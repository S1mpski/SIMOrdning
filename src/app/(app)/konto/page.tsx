import { createClient } from '@/lib/supabase/server';
import { Typography } from '@mui/material';

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }
}

<h1>
  <Typography>Kontoinställningar Placeholder for now, beep boop.</Typography>;
</h1>;
