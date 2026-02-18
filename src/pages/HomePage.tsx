import { useState, useEffect } from 'react'
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
import EditIcon from '@mui/icons-material/Edit'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'
import { useUserName } from '../hooks/useUserName'

function useAttendees() {
  const [attendees, setAttendees] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}attendees.json`)
      .then((r) => r.json())
      .then((data: string[]) => setAttendees(data))
      .catch(() => setAttendees([]))
      .finally(() => setLoading(false))
  }, [])

  return { attendees, loading }
}

export default function HomePage() {
  const [name, setName] = useUserName()
  const [draft, setDraft] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const { attendees, loading } = useAttendees()
  const navigate = useNavigate()

  const showPicker = !name || editing

  if (showPicker) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center" gap={3} pt={8}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Scanference
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
                label="Search your name"
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
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" gap={4} pt={6} pb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Scanference
        </Typography>

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

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <QRCode value={name} size={220} />
        </Paper>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Show this to others so they can scan you.
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<QrCode2Icon />}
          onClick={() => navigate('/scan')}
          sx={{ mt: 1, px: 5, py: 1.5 }}
        >
          Scan Someone
        </Button>
      </Box>
    </Container>
  )
}
