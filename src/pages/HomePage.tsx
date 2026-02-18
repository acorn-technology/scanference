import { useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'
import { useUserName } from '../hooks/useUserName'
import { useAttendees } from '../hooks/useAttendees'
import { useScore } from '../hooks/useScore'

export default function HomePage() {
  const [name, setName] = useUserName()
  const [draft, setDraft] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const { attendees, loading } = useAttendees()
  const { score, completedCount } = useScore(name)
  const navigate = useNavigate()

  const showPicker = !name || editing

  if (showPicker) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center" gap={3} pt={8}>
          <Box component="img" src={`${import.meta.env.BASE_URL}logo.png`} alt="Acorn Technology" sx={{ height: 56, mb: 2 }} />
          <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center">
            Granada Conference 2026
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Select your name to get your personal QR code.
          </Typography>

          <Autocomplete
            options={attendees}
            loading={loading}
            value={draft}
            onChange={(_, value) => setDraft(value)}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select your name"
                sx={{ bgcolor: 'white', borderRadius: 1 }}
                inputProps={{ ...params.inputProps, readOnly: true }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading && <CircularProgress size={18} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={!draft}
            onClick={() => {
              if (draft) {
                setName(draft)
                setEditing(false)
              }
            }}
          >
            {editing ? 'Save' : "Let's go"}
          </Button>

        </Box>
      </Container>
    )
  }

  return (
    <>
      <Box sx={{ position: 'fixed', top: 16, left: 16 }}>
        <Box component="img" src={`${import.meta.env.BASE_URL}logo.png`} alt="Acorn Technology" sx={{ height: 37 }} />
      </Box>
      <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" gap={4} pt={12} pb={4}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6">{name}</Typography>
          <Tooltip title="Change name">
            <IconButton
              size="small"
              onClick={() => {
                setDraft(name)
                setEditing(true)
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {completedCount} {completedCount === 1 ? 'match' : 'matches'} found &mdash; {score} pts
        </Typography>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <QRCode value={name} size={220} />
        </Paper>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Show this to others so they can scan you.
        </Typography>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            size="large"
            startIcon={<QrCode2Icon />}
            onClick={() => navigate('/scan')}
            sx={{ px: 3, py: 1.5 }}
          >
            Scan Someone
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<SearchIcon />}
            onClick={() => navigate('/lookup')}
            sx={{ px: 3, py: 1.5 }}
          >
            Look Up
          </Button>
        </Box>

      </Box>
    </Container>
    </>
  )
}
