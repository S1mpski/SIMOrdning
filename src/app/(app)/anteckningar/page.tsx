'use client';

import { useEffect, useRef, useState } from 'react';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useCompany } from '@/components/providers/company-provider';
import { createClient } from '@/lib/supabase/client';

type Note = {
  id: string;
  company_id: string;
  title: string;
  content: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

type Member = {
  user_id: string | null;
  name: string | null;
  role: string | null;
};

export default function NotesPage() {
  const company = useCompany();

  const [notes, setNotes] = useState<Note[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [saveState, setSaveState] = useState<
    'saved' | 'saving' | 'unsaved' | 'error'
  >('saved');

  const skipAutoSaveRef = useRef(true);

  const selectedNote = notes.find((note) => note.id === selectedId) ?? null;

  /*
   * Hämta anteckningar + medlemmar.
   */
  useEffect(() => {
    if (!company?.id) return;

    async function loadData() {
      setLoading(true);

      const supabase = createClient();

      const [notesResult, membersResult] = await Promise.all([
        supabase
          .from('company_notes')
          .select(
            `
              id,
              company_id,
              title,
              content,
              created_by,
              created_at,
              updated_at
            `,
          )
          .eq('company_id', company.id)
          .order('updated_at', {
            ascending: false,
          }),

        supabase
          .from('company_members')
          .select('user_id, name, role')
          .eq('company_id', company.id),
      ]);

      if (notesResult.error) {
        console.error(notesResult.error);
      }

      if (membersResult.error) {
        console.error(membersResult.error);
      }

      const loadedNotes = notesResult.data ?? [];

      setNotes(loadedNotes);
      setMembers(membersResult.data ?? []);

      if (loadedNotes.length > 0) {
        setSelectedId(loadedNotes[0].id);
      }

      setLoading(false);
    }

    loadData();
  }, [company?.id]);

  /*
   * Fyll editorn när vald anteckning ändras.
   */
  useEffect(() => {
    if (!selectedNote) {
      setTitle('');
      setContent('');
      return;
    }

    skipAutoSaveRef.current = true;

    setTitle(selectedNote.title);
    setContent(selectedNote.content);
    setSaveState('saved');
  }, [selectedId]);

  /*
   * Autosave.
   *
   * Väntar 1 sekund efter senaste ändringen.
   */
  useEffect(() => {
    if (!selectedNote) return;

    if (skipAutoSaveRef.current) {
      skipAutoSaveRef.current = false;
      return;
    }

    setSaveState('unsaved');

    const timeout = window.setTimeout(async () => {
      setSaveState('saving');

      const supabase = createClient();

      const cleanTitle = title.trim() || 'Ny anteckning';
      const updatedAt = new Date().toISOString();

      const { error } = await supabase
        .from('company_notes')
        .update({
          title: cleanTitle,
          content,
          updated_at: updatedAt,
        })
        .eq('id', selectedNote.id);

      if (error) {
        console.error(error);
        setSaveState('error');
        return;
      }

      setNotes((previous) =>
        previous
          .map((note) =>
            note.id === selectedNote.id
              ? {
                  ...note,
                  title: cleanTitle,
                  content,
                  updated_at: updatedAt,
                }
              : note,
          )
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime(),
          ),
      );

      setSaveState('saved');
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [title, content, selectedNote?.id]);

  async function createNote() {
    if (!company?.id || creating) return;

    setCreating(true);

    const supabase = createClient();

    const { data, error } = await supabase
      .from('company_notes')
      .insert({
        company_id: company.id,
        title: 'Ny anteckning',
        content: '',
      })
      .select(
        `
          id,
          company_id,
          title,
          content,
          created_by,
          created_at,
          updated_at
        `,
      )
      .single();

    if (error) {
      console.error(error);
      setCreating(false);
      return;
    }

    setNotes((previous) => [data, ...previous]);

    skipAutoSaveRef.current = true;

    setSelectedId(data.id);
    setTitle(data.title);
    setContent(data.content);

    setCreating(false);
  }

  async function deleteNote() {
    if (!selectedNote || deleting) return;

    const confirmed = window.confirm(
      `Vill du ta bort anteckningen "${selectedNote.title}"?`,
    );

    if (!confirmed) return;

    setDeleting(true);

    const supabase = createClient();

    const { error } = await supabase
      .from('company_notes')
      .delete()
      .eq('id', selectedNote.id);

    if (error) {
      console.error(error);
      setDeleting(false);
      return;
    }

    const remaining = notes.filter((note) => note.id !== selectedNote.id);

    setNotes(remaining);

    if (remaining.length > 0) {
      skipAutoSaveRef.current = true;

      setSelectedId(remaining[0].id);
      setTitle(remaining[0].title);
      setContent(remaining[0].content);
    } else {
      setSelectedId(null);
      setTitle('');
      setContent('');
    }

    setDeleting(false);
  }

  function getCreator(note: Note) {
    if (!note.created_by) {
      return {
        name: 'Okänd användare',
        role: null,
      };
    }

    const member = members.find((item) => item.user_id === note.created_by);

    return {
      name: member?.name ?? 'Företagsägare',
      role: member?.role ?? null,
    };
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleString('sv-SE', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1800,
        mx: 'auto',
        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}>
      <Stack spacing={2}>
        {/* HEADER */}
        <Box>
          <Typography
            variant='h4'
            sx={{
              fontWeight: 700,
            }}>
            Anteckningar
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              mt: 0.5,
            }}>
            Gemensamma anteckningar för {company?.name ?? 'företaget'}.
          </Typography>
        </Box>

        <Card variant='outlined'>
          <CardContent
            sx={{
              p: '0 !important',
            }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '300px minmax(0, 1fr)',
                },
                minHeight: 680,
              }}>
              {/* VÄNSTERPANEL */}
              <Box
                sx={{
                  borderRight: {
                    xs: 'none',
                    md: '1px solid',
                  },
                  borderBottom: {
                    xs: '1px solid',
                    md: 'none',
                  },
                  borderColor: 'divider',
                  minWidth: 0,
                }}>
                <Box
                  sx={{
                    p: 2,
                  }}>
                  <Button
                    variant='contained'
                    fullWidth
                    startIcon={<AddOutlinedIcon />}
                    disabled={creating}
                    onClick={createNote}>
                    {creating ? 'Skapar...' : 'Ny anteckning'}
                  </Button>
                </Box>

                <Divider />

                {loading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      py: 5,
                    }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : notes.length === 0 ? (
                  <Box
                    sx={{
                      px: 2,
                      py: 4,
                      textAlign: 'center',
                    }}>
                    <NotesOutlinedIcon
                      sx={{
                        fontSize: 36,
                        color: 'text.disabled',
                        mb: 1,
                      }}
                    />

                    <Typography variant='body2' color='text.secondary'>
                      Inga anteckningar ännu.
                    </Typography>
                  </Box>
                ) : (
                  <List disablePadding>
                    {notes.map((note) => {
                      const creator = getCreator(note);

                      return (
                        <Box key={note.id}>
                          <ListItemButton
                            selected={note.id === selectedId}
                            onClick={() => setSelectedId(note.id)}
                            sx={{
                              px: 2,
                              py: 1.5,
                              alignItems: 'flex-start',
                            }}>
                            <ListItemText
                              primary={note.title}
                              secondary={
                                <>
                                  <Typography
                                    component='span'
                                    variant='caption'
                                    color='text.secondary'
                                    sx={{
                                      display: 'block',
                                    }}>
                                    {creator.name}
                                    {creator.role ? ` · ${creator.role}` : ''}
                                  </Typography>

                                  <Typography
                                    component='span'
                                    variant='caption'
                                    color='text.disabled'
                                    sx={{
                                      display: 'block',
                                      mt: 0.25,
                                    }}>
                                    {formatDate(note.updated_at)}
                                  </Typography>
                                </>
                              }
                              slotProps={{
                                primary: {
                                  sx: {
                                    fontSize: 14,
                                    fontWeight: 600,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  },
                                },
                              }}
                            />
                          </ListItemButton>

                          <Divider />
                        </Box>
                      );
                    })}
                  </List>
                )}
              </Box>

              {/* EDITOR */}
              <Box
                sx={{
                  p: {
                    xs: 2,
                    sm: 3,
                  },
                  minWidth: 0,
                }}>
                {selectedNote ? (
                  <Stack
                    spacing={2}
                    sx={{
                      height: '100%',
                    }}>
                    {/* Editor header */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                      }}>
                      <Box>
                        <Typography variant='caption' color='text.secondary'>
                          Skapad av
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 600,
                          }}>
                          {getCreator(selectedNote).name}

                          {getCreator(selectedNote).role &&
                            ` · ${getCreator(selectedNote).role}`}
                        </Typography>
                      </Box>

                      <Typography
                        variant='caption'
                        color={
                          saveState === 'error'
                            ? 'error.main'
                            : 'text.secondary'
                        }>
                        {saveState === 'saving' && 'Sparar...'}

                        {saveState === 'unsaved' && 'Ändringar...'}

                        {saveState === 'saved' && 'Sparad'}

                        {saveState === 'error' && 'Kunde inte spara'}
                      </Typography>
                    </Box>

                    <Divider />

                    <TextField
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder='Titel'
                      fullWidth
                      variant='standard'
                      slotProps={{
                        input: {
                          disableUnderline: true,
                        },
                      }}
                      sx={{
                        '& input': {
                          fontSize: 26,
                          fontWeight: 700,
                        },
                      }}
                    />

                    <TextField
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      placeholder='Börja skriva...'
                      multiline
                      fullWidth
                      minRows={22}
                      sx={{
                        flex: 1,

                        '& .MuiOutlinedInput-root': {
                          alignItems: 'flex-start',
                        },
                      }}
                    />

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                      }}>
                      <Typography variant='caption' color='text.secondary'>
                        Senast uppdaterad {formatDate(selectedNote.updated_at)}
                      </Typography>

                      <Button
                        variant='outlined'
                        color='error'
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        disabled={deleting}
                        onClick={deleteNote}>
                        {deleting ? 'Tar bort...' : 'Ta bort'}
                      </Button>
                    </Box>
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      minHeight: 600,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}>
                    <NotesOutlinedIcon
                      sx={{
                        fontSize: 48,
                        color: 'text.disabled',
                        mb: 1.5,
                      }}
                    />

                    <Typography
                      sx={{
                        fontWeight: 600,
                      }}>
                      Ingen anteckning vald
                    </Typography>

                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{
                        mt: 0.5,
                      }}>
                      Skapa en ny anteckning för att börja.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
