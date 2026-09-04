'use client';

import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useTheme } from '@mui/material/styles';
import { useCompany } from '@/components/providers/company-provider';

export type ExpenseChartItem = {
  id: string;
  label: string;
  value: number;
};

type Props = {
  data: ExpenseChartItem[];
};

function formatCurrency(value: number) {
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function ExpenseChart({ data }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const theme = useTheme();

  const chartColors = [theme.palette.simBlue.dark, theme.palette.simBlue.light];
  const company = useCompany();

  return (
    <Card
      variant='outlined'
      sx={{
        borderRadius: 1.5,
        height: '100%',
      }}>
      <CardContent
        sx={{
          p: 2.5,
          '&:last-child': {
            pb: 2.5,
          },
        }}>
        <Stack spacing={2}>
          <Box>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
              }}>
              Kostnadsfördelning
            </Typography>

            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ mt: 0.25 }}>
              Fördelning av {company?.name ?? 'företaget'}
              {'s'} bokförda kostnader.
            </Typography>
          </Box>

          {data.length === 0 || total === 0 ? (
            <Box
              sx={{
                py: 5,
                textAlign: 'center',
              }}>
              <Typography color='text.secondary'>
                Inga kostnader bokförda ännu.
              </Typography>
            </Box>
          ) : (
            <Stack
              direction='column'
              spacing={1.5}
              sx={{
                alignItems: 'center',
              }}>
              <Box
                sx={{
                  width: '100%',

                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <PieChart
                  height={180}
                  colors={chartColors}
                  series={[
                    {
                      data,
                      innerRadius: 45,
                      outerRadius: 72,
                      paddingAngle: 2,
                      cornerRadius: 3,
                      highlightScope: {
                        fade: 'global',
                        highlight: 'item',
                      },
                      faded: {
                        innerRadius: 45,
                        additionalRadius: -5,
                      },
                    },
                  ]}
                  hideLegend
                />
              </Box>

              <Stack
                spacing={1.25}
                sx={{
                  width: '100%',
                  minWidth: 0,
                }}>
                {data.map((item) => {
                  const percentage = total > 0 ? (item.value / total) * 100 : 0;

                  return (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                      }}>
                      <Box
                        sx={{
                          minWidth: 0,
                        }}>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                          noWrap>
                          {item.label}
                        </Typography>

                        <Typography variant='caption' color='text.secondary'>
                          {percentage.toLocaleString('sv-SE', {
                            maximumFractionDigits: 1,
                          })}
                          %
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}>
                        {formatCurrency(item.value)} kr
                      </Typography>
                    </Box>
                  );
                })}

                <Box
                  sx={{
                    pt: 1,
                    mt: 0.5,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                    }}>
                    Totalt
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                    }}>
                    {formatCurrency(total)} kr
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
