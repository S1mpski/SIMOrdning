'use client';

import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';

export type SummaryDonutItem = {
  id: string;
  label: string;
  value: number;
  color?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  data: SummaryDonutItem[];
  chartData?: SummaryDonutItem[];
  centerLabel: string;
  centerValue: number;
  percentageBase?: number;
  centerColor?: string;
  hasAccountingData?: boolean;
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
  chartData,
  centerLabel,
  centerValue,
  percentageBase,
  centerColor,
  hasAccountingData = true,
}: Props) {
  const theme = useTheme();

  const chartColors = [theme.palette.simBlue.dark, theme.palette.simBlue.light];

  const filteredData = data.filter((item) => item.value !== 0);

  const sourceChartData = chartData ?? data;

  const filteredChartData = sourceChartData
    .filter((item) => item.value !== 0)
    .map((item, index) => ({
      ...item,
      value: Math.abs(item.value),
      color: item.color ?? chartColors[index % chartColors.length],
    }));

  const chartTotal = filteredChartData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  const percentageTotal =
    percentageBase !== undefined && Math.abs(percentageBase) > 0
      ? Math.abs(percentageBase)
      : filteredData.reduce((sum, item) => sum + Math.abs(item.value), 0);

  const hasData =
    filteredData.length > 0 && filteredChartData.length > 0 && chartTotal > 0;

  return (
    <Card
      variant='outlined'
      sx={{
        height: '100%',
        borderRadius: 1.5,
        minWidth: 0,
        overflow: 'hidden',
      }}>
      <CardContent
        sx={{
          p: {
            xs: 2,
            md: 2.5,
          },

          '&:last-child': {
            pb: {
              xs: 2,
              md: 2.5,
            },
          },
        }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
            }}>
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                mt: 0.25,
                overflowWrap: 'anywhere',
              }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {!hasAccountingData ? (
          <Box
            sx={{
              minHeight: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
            <Typography color='text.secondary'>Ingen data ännu.</Typography>
          </Box>
        ) : centerValue === 0 ? (
          <Box
            sx={{
              minHeight: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                }}>
                0 kr
              </Typography>

              <Typography variant='body2' color='text.secondary'>
                Nollresultat
              </Typography>
            </Box>
          </Box>
        ) : !hasData ? (
          <Box
            sx={{
              minHeight: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}>
            <Typography color='text.secondary'>Ingen data ännu.</Typography>
          </Box>
        ) : (
          <Stack
            direction={{
              xs: 'column',
              md: 'row',
            }}
            sx={{
              mt: 1.5,
              minHeight: 220,
              gap: 2,

              alignItems: {
                xs: 'stretch',
                md: 'center',
              },

              minWidth: 0,
            }}>
            {/* DATA */}
            <Stack
              spacing={1.5}
              sx={{
                flex: 1,
                width: '100%',
                minWidth: 0,

                justifyContent: {
                  xs: 'flex-start',
                  md: 'center',
                },
              }}>
              {filteredData.map((item) => {
                const percentage =
                  percentageTotal > 0
                    ? (item.value / percentageTotal) * 100
                    : 0;

                return (
                  <Box
                    key={item.id}
                    sx={{
                      minWidth: 0,
                    }}>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                      {item.label}
                    </Typography>

                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{
                        overflowWrap: 'anywhere',
                      }}>
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

            {/* DONUT */}
            <Box
              sx={{
                position: 'relative',
                width: 150,
                height: 150,
                flexShrink: 0,

                mx: {
                  xs: 'auto',
                  md: 0,
                },

                ml: {
                  md: 'auto',
                },

                mt: {
                  xs: 1,
                  md: 0,
                },
              }}>
              <PieChart
                width={150}
                height={150}
                series={[
                  {
                    data: filteredChartData,
                    innerRadius: 40,
                    outerRadius: 70,
                    paddingAngle: 2,
                    cornerRadius: 3,

                    highlightScope: {
                      fade: 'global',
                      highlight: 'item',
                    },

                    faded: {
                      innerRadius: 40,
                      additionalRadius: -4,
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
                <Box
                  sx={{
                    textAlign: 'center',
                    maxWidth: 85,
                  }}>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: centerColor ?? 'text.primary',
                    }}>
                    {formatCurrency(centerValue)} kr
                  </Typography>

                  <Typography
                    variant='caption'
                    sx={{
                      display: 'block',
                      mt: 0.25,
                      lineHeight: 1.2,
                      color: centerColor ?? 'text.secondary',
                    }}>
                    {centerLabel}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
