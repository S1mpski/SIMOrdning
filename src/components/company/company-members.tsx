'use client';

import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { createClient } from '@/lib/supabase/client';
import { Description } from '@mui/icons-material';
import { name } from 'next/dist/server/ci-info';
import { useCompany } from '@/components/providers/company-provider';

type CompanyMember = {
  id: string;
  company_id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  created_at: string;
};

type Props = {
  companyId: string;
  initialMembers: CompanyMember[];
  canManage: boolean;
};

type MemberForm = {
  name: string;
  email: string;
  phone: string;
  role: string;
};

const emptyForm: MemberForm = {
  name: '',
  email: '',
  phone: '',
  role: '',
};

const inviteRoles = [
  {
    value: 'member',
    label: 'Medlem',
    description: 'Medlemmar kan se alla sidor, men kan inte justera något.',
  },
  {
    value: 'ceo',
    label: 'VD',
    description:
      'VD:n kan läsa alla sidor, men endast justera företagsuppgifter.',
  },
  {
    value: 'co_owner',
    label: 'Delägare',
    description: 'Delägare kan både läsa och justera alla sidor.',
  },
];

export default function CompanyMembers({
  companyId,
  initialMembers,
  canManage,
}: Props) {
  const supabase = createClient();

  const [members, setMembers] = useState<CompanyMember[]>(initialMembers);

  const [form, setForm] = useState<MemberForm>(emptyForm);

  const [open, setOpen] = useState(false);

  const [editingMember, setEditingMember] = useState<CompanyMember | null>(
    null,
  );

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');

  const [inviteOpen, setInviteOpen] = useState(false);

  const [inviteEmail, setInviteEmail] = useState('');

  const [inviteSaving, setInviteSaving] = useState(false);

  const [inviteError, setInviteError] = useState('');

  const [inviteSuccess, setInviteSuccess] = useState('');

  const [inviteRole, setInviteRole] = useState('member');

  function handleOpenCreate() {
    setEditingMember(null);
    setForm(emptyForm);
    setError('');
    setOpen(true);
  }

  function handleOpenEdit(member: CompanyMember) {
    setEditingMember(member);

    setForm({
      name: member.name ?? '',
      email: member.email ?? '',
      phone: member.phone ?? '',
      role: member.role ?? '',
    });

    setError('');
    setOpen(true);
  }

  function handleClose() {
    if (saving) {
      return;
    }

    setOpen(false);
    setEditingMember(null);
    setForm(emptyForm);
    setError('');
  }

  function updateField(field: keyof MemberForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    if (!canManage) {
      setError('Du har endast läsbehörighet för personer i företaget.');
      return;
    }

    if (!form.name.trim()) {
      setError('Namn måste anges.');
      return;
    }

    setSaving(true);
    setError('');

    if (editingMember) {
      const { data, error: updateError } = await supabase
        .from('company_members')
        .update({
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          role: form.role || null,
        })
        .eq('id', editingMember.id)
        .select()
        .single();

      if (updateError) {
        setSaving(false);
        setError(updateError.message);
        return;
      }

      setMembers((current) =>
        current.map((member) =>
          member.id === editingMember.id ? data : member,
        ),
      );
    } else {
      const { data, error: insertError } = await supabase
        .from('company_members')
        .insert({
          company_id: companyId,
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          role: form.role || null,
        })
        .select()
        .single();

      if (insertError) {
        setSaving(false);
        setError(insertError.message);
        return;
      }

      setMembers((current) => [...current, data]);
    }

    setSaving(false);
    handleClose();
  }

  async function handleInvite() {
    if (!canManage) {
      setInviteError('Du har inte behörighet att bjuda in användare.');
      return;
    }

    const email = inviteEmail.trim().toLowerCase();

    if (!email) {
      setInviteError('E-post måste anges.');
      return;
    }

    setInviteSaving(true);
    setInviteError('');
    setInviteSuccess('');

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setInviteSaving(false);
      setInviteError('Kunde inte identifiera den inloggade användaren.');
      return;
    }

    const { error: insertError } = await supabase
      .from('company_invitations')
      .insert({
        company_id: companyId,
        email,
        role: inviteRole,
        invited_by: user.id,
      });

    if (insertError) {
      setInviteSaving(false);

      if (insertError.code === '23505') {
        setInviteError(
          'Det finns redan en aktiv inbjudan till den e-postadressen.',
        );
        return;
      }

      setInviteError(insertError.message);
      return;
    }

    setInviteSaving(false);
    setInviteEmail('');
    setInviteSuccess(`En inbjudan har skapats för ${email}.`);
  }

  async function handleDelete(member: CompanyMember) {
    if (!canManage) {
      setError('Du har inte behörighet att ta bort personer.');
      return;
    }

    const confirmed = window.confirm(`Vill du ta bort ${member.name}?`);

    if (!confirmed) {
      return;
    }

    const { error: deleteError } = await supabase
      .from('company_members')
      .delete()
      .eq('id', member.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setMembers((current) => current.filter((item) => item.id !== member.id));
  }

  const company = useCompany();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 2000,
        mx: 'auto',
        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}>
      <Card
        variant='outlined'
        sx={{
          mt: 3,
          borderRadius: 1.5,
        }}>
        <CardContent
          sx={{
            p: 2.5,
            '&:last-child': {
              pb: 2.5,
            },
          }}>
          <Stack spacing={2.5}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                  }}>
                  Personer i {company?.name ?? 'företaget'}
                </Typography>

                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mt: 0.25 }}>
                  Ägare, styrelse, firmatecknare och andra personer.
                </Typography>
              </Box>

              {canManage && (
                <Stack direction='row' spacing={1}>
                  <Button
                    variant='outlined'
                    size='small'
                    onClick={() => {
                      setInviteEmail('');
                      setInviteRole('member');
                      setInviteError('');
                      setInviteSuccess('');
                      setInviteOpen(true);
                    }}>
                    Bjud in användare
                  </Button>

                  <Button
                    variant='contained'
                    size='small'
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreate}>
                    Lägg till person
                  </Button>
                </Stack>
              )}
            </Box>

            {error && <Alert severity='error'>{error}</Alert>}

            {members.length === 0 ? (
              <Box
                sx={{
                  py: 4,
                  textAlign: 'center',
                }}>
                <Typography color='text.secondary'>
                  Inga personer har lagts till ännu.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1}>
                {members.map((member) => (
                  <Box
                    key={member.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1.5,
                    }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                        }}>
                        {member.name}
                      </Typography>

                      {member.role && (
                        <Typography variant='body2' color='text.secondary'>
                          {member.role === 'member'
                            ? 'Medlem'
                            : member.role === 'ceo'
                              ? 'VD'
                              : member.role === 'co_owner'
                                ? 'Delägare'
                                : member.role === 'owner'
                                  ? 'Ägare'
                                  : member.role}
                        </Typography>
                      )}

                      {(member.email || member.phone) && (
                        <Typography variant='caption' color='text.secondary'>
                          {member.email}
                          {member.email && member.phone ? ' • ' : ''}
                          {member.phone}
                        </Typography>
                      )}
                    </Box>

                    {canManage && (
                      <Stack direction='row' spacing={0.5}>
                        <IconButton
                          size='small'
                          onClick={() => handleOpenEdit(member)}>
                          <EditOutlinedIcon fontSize='small' />
                        </IconButton>

                        <IconButton
                          size='small'
                          color='error'
                          onClick={() => handleDelete(member)}>
                          <DeleteOutlineOutlinedIcon fontSize='small' />
                        </IconButton>
                      </Stack>
                    )}
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>
          {editingMember ? 'Redigera person' : 'Lägg till person'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity='error'>{error}</Alert>}

            <TextField
              label='Namn'
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              fullWidth
              size='small'
              required
            />

            <TextField
              select
              label='Roll'
              value={form.role}
              onChange={(event) => updateField('role', event.target.value)}
              fullWidth
              size='small'>
              <MenuItem value=''>Ej angiven</MenuItem>
              <MenuItem value='Ägare'>Ägare</MenuItem>
              <MenuItem value='Delägare'>Delägare</MenuItem>
              <MenuItem value='VD'>VD</MenuItem>
              <MenuItem value='Styrelseledamot'>Styrelseledamot</MenuItem>
              <MenuItem value='Firmatecknare'>Firmatecknare</MenuItem>
              <MenuItem value='Revisor'>Revisor</MenuItem>
              <MenuItem value='Bokförare'>Bokförare</MenuItem>
              <MenuItem value='Anställd'>Anställd</MenuItem>
              <MenuItem value='Kontaktperson'>Kontaktperson</MenuItem>
            </TextField>

            <TextField
              label='E-post'
              type='email'
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              fullWidth
              size='small'
            />

            <TextField
              label='Telefon'
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              fullWidth
              size='small'
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>
            Avbryt
          </Button>

          <Button variant='contained' onClick={handleSave} disabled={saving}>
            {saving ? 'Sparar...' : editingMember ? 'Spara' : 'Lägg till'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={inviteOpen}
        onClose={() => {
          if (!inviteSaving) {
            setInviteOpen(false);
            setInviteError('');
            setInviteSuccess('');
          }
        }}
        fullWidth
        maxWidth='sm'>
        <DialogTitle>
          Bjud in användare till {company?.name ?? 'företaget'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack spacing={0} sx={{ mt: -1 }}>
              <Typography variant='body2' color='text.secondary'>
                Användaren får tillgång till bokföring av{' '}
                {company?.name ?? 'företaget'}
                {'s'} när inbjudan har accepterats.
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Se över vilka behörigheter du vill ge.
              </Typography>
            </Stack>
            {inviteError && <Alert severity='error'>{inviteError}</Alert>}

            {inviteSuccess && <Alert severity='success'>{inviteSuccess}</Alert>}

            <TextField
              label='E-post'
              type='email'
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              fullWidth
              size='medium'
              required
              disabled={inviteSaving}
            />

            <TextField
              select
              label='Bjud in som'
              value={inviteRole}
              onChange={(event) => setInviteRole(event.target.value)}
              fullWidth
              size='medium'
              disabled={inviteSaving}
              slotProps={{
                select: {
                  renderValue: (value) =>
                    inviteRoles.find((role) => role.value === value)?.label ??
                    '',
                },
              }}>
              {inviteRoles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 700,
                      }}>
                      {role.label}
                    </Typography>

                    <Typography
                      variant='caption'
                      color='text.secondary'
                      sx={{
                        display: 'block',
                      }}>
                      {role.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: 'action.hover',
                border: 1,
                borderColor: 'gray',
              }}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Behörighet
              </Typography>

              <Typography variant='body2' color='text.secondary'>
                {
                  inviteRoles.find((role) => role.value === inviteRole)
                    ?.description
                }
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setInviteOpen(false);
              setInviteError('');
              setInviteSuccess('');
            }}
            disabled={inviteSaving}>
            Stäng
          </Button>

          <Button
            variant='contained'
            onClick={handleInvite}
            disabled={inviteSaving || !inviteEmail.trim()}>
            {inviteSaving ? 'Skapar inbjudan...' : 'Bjud in'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
