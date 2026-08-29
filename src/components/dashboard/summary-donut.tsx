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

  // Informationen som visas längst ner
  data: SummaryDonutItem[];

  // Om satt används annan data enbart för själva diagrammet
  chartData?: SummaryDonutItem[];

  centerLabel: string;
  centerValue: number;

  // Exempelvis intäkter = 100 %
  percentageBase?: number;

  centerColor?: string;
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
}: Props) {
  const theme = useTheme();

  const chartColors = [theme.palette.simBlue.dark, theme.palette.simBlue.light];

  // Textvärden – behåll negativa värden
  const filteredData = data.filter((item) => item.value !== 0);

  // Diagrammet får aldrig negativa segment
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
      }}>
      <CardContent
        sx={{
          p: 2,
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

        {!hasData ? (
          <Box
            sx={{
              py: 6,
              textAlign: 'center',
            }}>
            <Typography color='text.secondary'>Ingen data ännu.</Typography>
          </Box>
        ) : (
          <Stack
            direction='row'
            sx={{
              mt: 1.5,
              minHeight: 220,
              gap: 2,
              alignItems: 'stretch',
            }}>
            {/* Information längst ner */}
            <Stack
              spacing={1.5}
              sx={{
                flex: 1,
                minWidth: 0,
                justifyContent: 'flex-end',
                pb: 1,
              }}>
              {filteredData.map((item) => {
                const percentage =
                  percentageTotal > 0
                    ? (item.value / percentageTotal) * 100
                    : 0;

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

            {/* Diagram till höger */}
            <Box
              sx={{
                position: 'relative',
                width: 150,
                height: 150,
                flexShrink: 0,
                ml: 'auto',
                mt: 0.5,
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
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: centerColor ?? 'text.primary',
                    }}>
                    {formatCurrency(centerValue)} kr
                  </Typography>

                  <Typography
                    variant='caption'
                    sx={{
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
