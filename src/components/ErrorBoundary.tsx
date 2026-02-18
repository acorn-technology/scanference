import { Component, ReactNode } from 'react'
import { Alert, Box, Button, Container, Typography } from '@mui/material'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <Container maxWidth="sm">
          <Box pt={6} display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Something went wrong</Typography>
            <Alert severity="error">{this.state.error.message}</Alert>
            <Button variant="contained" onClick={() => this.setState({ error: null })}>
              Try again
            </Button>
          </Box>
        </Container>
      )
    }
    return this.props.children
  }
}
