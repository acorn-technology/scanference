import { useState } from 'react'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useNavigate } from 'react-router-dom'
import { useUserName } from '../hooks/useUserName'
import { useScore } from '../hooks/useScore'
import { useAttendees } from '../hooks/useAttendees'

type LookupResult = { topic: string; keyword: string }

type PageState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'question'; result: LookupResult; scannedName: string; wrongAttempt: boolean }
  | { status: 'correct'; scannedName: string; keyword: string }
  | { status: 'already_done'; scannedName: string }
  | { status: 'not_found' }
  | { status: 'error'; message: string }

async function lookupPair(myName: string, scannedName: string): Promise<LookupResult | null> {
  const res = await fetch(`${import.meta.env.BASE_URL}lookup.json`)
  if (!res.ok) throw new Error('Failed to load lookup table')
  const table: Record<string, LookupResult> = await res.json()
  return table[`${myName}+${scannedName}`] ?? table[`${scannedName}+${myName}`] ?? null
}

export default function LookupPage() {
  const [userName] = useUserName()
  const navigate = useNavigate()
  const { score, addPoint, isCompleted } = useScore(userName)
  const { attendees, loading } = useAttendees()
  const [pageState, setPageState] = useState<PageState>({ status: 'idle' })
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')

  const handleLookup = async () => {
    if (!selectedName) return
    setPageState({ status: 'loading' })
    try {
      if (isCompleted(userName ?? '', selectedName)) {
        setPageState({ status: 'already_done', scannedName: selectedName })
        return
      }
      const result = await lookupPair(userName ?? '', selectedName)
      setPageState(
        result !== null
          ? { status: 'question', result, scannedName: selectedName, wrongAttempt: false }
          : { status: 'not_found' },
      )
    } catch (err) {
      setPageState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Lookup failed',
      })
    }
  }

  const handleSubmitAnswer = () => {
    if (pageState.status !== 'question') return
    const { result, scannedName } = pageState
    if (answer.trim().toLowerCase() === result.keyword.toLowerCase()) {
      addPoint(userName ?? '', scannedName)
      setPageState({ status: 'correct', scannedName, keyword: result.keyword })
      setAnswer('')
    } else {
      setPageState({ ...pageState, wrongAttempt: true })
    }
  }

  const handleClose = () => {
    setAnswer('')
    setSelectedName(null)
    setPageState({ status: 'idle' })
  }

  const isDialogOpen =
    pageState.status === 'question' ||
    pageState.status === 'correct' ||
    pageState.status === 'already_done' ||
    pageState.status === 'not_found'

  const otherAttendees = attendees.filter((a) => a !== userName)

  return (
    <Container maxWidth="sm">
      <Box pt={3} pb={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
            Back
          </Button>
          <Typography variant="h6" fontWeight="bold">
            Look Up Name
          </Typography>
        </Box>
        <Typography variant="body1" fontWeight="bold" color="primary">
          {score} pts
        </Typography>
      </Box>

      {pageState.status === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {pageState.message}
        </Alert>
      )}

      <Box display="flex" gap={1} alignItems="center" mt={2}>
        <Autocomplete
          options={otherAttendees}
          loading={loading}
          value={selectedName}
          onChange={(_, value) => setSelectedName(value)}
          fullWidth
          renderOption={(props, option) => {
            const { key, ...rest } = props as { key: string } & React.HTMLAttributes<HTMLLIElement>
            const done = isCompleted(userName ?? '', option)
            return (
              <li key={key} {...rest}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <Typography sx={{ color: done ? 'text.disabled' : 'text.primary' }}>
                    {option}
                  </Typography>
                  {done && <CheckCircleIcon color="success" fontSize="small" />}
                </Box>
              </li>
            )
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select a name"
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
          onClick={handleLookup}
          disabled={!selectedName || pageState.status === 'loading'}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {pageState.status === 'loading' ? <CircularProgress size={20} color="inherit" /> : 'Look up'}
        </Button>
      </Box>

      <Dialog open={isDialogOpen} maxWidth="xs" fullWidth>
        {pageState.status === 'question' && (
          <>
            <DialogTitle>Match Found!</DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {pageState.result.topic}
              </Typography>
              {pageState.wrongAttempt && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Wrong answer, try again!
                </Alert>
              )}
              <TextField
                fullWidth
                autoFocus
                label="Your answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                sx={{ bgcolor: 'white' }}
              />
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handleSubmitAnswer} disabled={!answer.trim()}>
                Submit
              </Button>
              <Button onClick={handleClose}>Skip</Button>
            </DialogActions>
          </>
        )}

        {pageState.status === 'correct' && (
          <>
            <DialogTitle>+1 Point!</DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Correct! {pageState.scannedName} is now Done.
              </Typography>
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: 2,
                  px: 3,
                  py: 2,
                  textAlign: 'center',
                  letterSpacing: 3,
                  fontWeight: 'bold',
                  fontSize: '1.4rem',
                }}
              >
                {pageState.keyword}
              </Box>
              <Typography variant="h4" textAlign="center" fontWeight="bold" sx={{ mt: 2 }}>
                {score} pts
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handleClose}>
                Look up Another
              </Button>
              <Button onClick={() => navigate('/')}>Go Home</Button>
            </DialogActions>
          </>
        )}

        {pageState.status === 'already_done' && (
          <>
            <DialogTitle>Already Done</DialogTitle>
            <DialogContent>
              <Typography variant="body1" color="text.secondary">
                You've already matched with {pageState.scannedName}!
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handleClose}>
                OK
              </Button>
            </DialogActions>
          </>
        )}

        {pageState.status === 'not_found' && (
          <>
            <DialogTitle>No Match</DialogTitle>
            <DialogContent>
              <Typography variant="body1" color="text.secondary">
                No result defined for this pair.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handleClose}>
                OK
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  )
}
