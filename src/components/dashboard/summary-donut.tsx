'use client';

import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

export type SummaryDonutItem = {
  id: string;
  label: string;
  value: number;
};

type Props = {
  title: string;
  subtitle?: string;
  data: SummaryDonutItem[];
  centerLabel: string;
  centerValue: number;
};

function formatCurrency(value: number) {
  return value.toLocaleString('sv-SE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function SummaryDonut({
  title,
  subtitle,
  data,
  centerLabel,
  centerValue,
}: Props) {
  const filteredData = data.filter((item) => item.value > 0);

  const total = filteredData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card
      variant='outlined'
      sx={{
        height: '100%',
        borderRadius: 1.5,
      }}>
      <CardContent
        sx={{
          p: 2.5,
          '&:last-child': {
            pb: 2.5,
          },
        }}>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
          }}>
          {title}
        </Typography>

        {subtitle && (
          <Typography variant='body2' color='text.secondary' sx={{ mt: 0.25 }}>
            {subtitle}
          </Typography>
        )}

        {filteredData.length === 0 || total === 0 ? (
          <Box
            sx={{
              py: 6,
              textAlign: 'center',
            }}>
            <Typography color='text.secondary'>Ingen data ännu.</Typography>
          </Box>
        ) : (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              mt: 2,
              alignItems: 'center',
              gap: 2,
            }}>
            <Box
              sx={{
                position: 'relative',
                width: 220,
                height: 220,
                flexShrink: 0,
              }}>
              <PieChart
                width={220}
                height={220}
                series={[
                  {
                    data: filteredData,
                    innerRadius: 68,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 3,
                    highlightScope: {
                      fade: 'global',
                      highlight: 'item',
                    },
                    faded: {
                      innerRadius: 68,
                      additionalRadius: -5,
                    },
                  },
                ]}
                hideLegend
              />

              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 700,
                    }}>
                    {formatCurrency(centerValue)} kr
                  </Typography>

                  <Typography variant='caption' color='text.secondary'>
                    {centerLabel}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Stack
              spacing={1.5}
              sx={{
                flex: 1,
                width: '100%',
              }}>
              {filteredData.map((item) => {
                const percentage = total > 0 ? (item.value / total) * 100 : 0;

                return (
                  <Box key={item.id}>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                      }}>
                      {item.label}
                    </Typography>

                    <Typography variant='body2' color='text.secondary'>
                      {formatCurrency(item.value)} kr (
                      {percentage.toLocaleString('sv-SE', {
                        maximumFractionDigits: 1,
                      })}
                      %)
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
