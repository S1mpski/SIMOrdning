import { Box, Typography } from '@mui/material';

type Props = {
  companyId: string;
  companyName: string;
};

export default function AppHeader({ companyName }: Props) {
  return (
    <Box
      component='header'
      sx={{
        height: 88,
        px: 4,
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
      <Box>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: 'simBlue.main',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            mb: 0.25,
          }}>
          Aktivt företag
        </Typography>

        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.3px',
            color: 'text.primary',
          }}>
          {companyName}
        </Typography>
      </Box>
    </Box>
  );
}
