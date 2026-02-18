import { useState, useCallback } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useZxing } from 'react-zxing'
import type { Result } from '@zxing/library'
import { useNavigate } from 'react-router-dom'
import { useUserName } from '../hooks/useUserName'

type ScanState =
  | { status: 'scanning' }
  | { status: 'loading' }
  | { status: 'result'; value: string }
  | { status: 'not_found' }
  | { status: 'error'; message: string }

async function lookupPair(myName: string, scannedName: string): Promise<string | null> {
  const res = await fetch(`${import.meta.env.BASE_URL}lookup.json`)
  if (!res.ok) throw new Error('Failed to load lookup table')
  const table: Record<string, string> = await res.json()
  return table[`${myName}+${scannedName}`] ?? null
}

export default function ScanPage() {
  const [userName] = useUserName()
  const navigate = useNavigate()
  const [scanState, setScanState] = useState<ScanState>({ status: 'scanning' })
  const [paused, setPaused] = useState(false)

  const onDecodeResult = useCallback(
    async (result: Result) => {
      if (paused) return
      setPaused(true)
      setScanState({ status: 'loading' })
      try {
        const scannedName = result.getText()
        const value = await lookupPair(userName ?? '', scannedName)
        setScanState(value !== null ? { status: 'result', value } : { status: 'not_found' })
      } catch (err) {
        setScanState({
          status: 'error',
          message: err instanceof Error ? err.message : 'Lookup failed',
        })
      }
    },
    [userName, paused],
  )

  const { ref } = useZxing({
    paused,
    onDecodeResult,
    onError: (err) => {
      // ZXing fires this on every frame with no QR code — filter out noise
      if (err instanceof Error && err.message.includes('No MultiFormat')) return
      console.warn('Scanner error:', err)
    },
  })

  const handleScanAgain = () => {
    setPaused(false)
    setScanState({ status: 'scanning' })
  }

  const isDialogOpen = scanState.status === 'result' || scanState.status === 'not_found'

  return (
    <Container maxWidth="sm">
      <Box pt={3} pb={2} display="flex" alignItems="center" gap={1}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Back
        </Button>
        <Typography variant="h6" fontWeight="bold">
          Scan QR Code
        </Typography>
      </Box>

      {scanState.status === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {scanState.message}
        </Alert>
      )}

      <Box position="relative" sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'black' }}>
        <video
          ref={ref as React.RefObject<HTMLVideoElement>}
          style={{ width: '100%', display: 'block' }}
        />
        {scanState.status === 'loading' && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.5)',
            }}
          >
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        )}
      </Box>

      <Dialog open={isDialogOpen} maxWidth="xs" fullWidth>
        {scanState.status === 'result' && (
          <>
            <DialogTitle>Match Found</DialogTitle>
            <DialogContent>
              <Typography variant="body1">{scanState.value}</Typography>
            </DialogContent>
          </>
        )}
        {scanState.status === 'not_found' && (
          <>
            <DialogTitle>No Match</DialogTitle>
            <DialogContent>
              <Typography variant="body1" color="text.secondary">
                No result defined for this pair of QR codes.
              </Typography>
            </DialogContent>
          </>
        )}
        <DialogActions>
          <Button variant="contained" onClick={handleScanAgain}>
            Scan Again
          </Button>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
