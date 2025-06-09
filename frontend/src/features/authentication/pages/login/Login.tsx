import classes from './Login.module.scss'
import { Layout } from '../../components/layout/Layout'
import { useState } from 'react'
import { Box } from '../../components/box/Box'
import { Input } from '../../components/input/Input'
import { Button } from '../../components/button/Button'
import { Link } from 'react-router-dom'
import { Seperator } from '../../components/seperator/Seperator'

export function Login() {
  const [errorMessage, setErrorMessage] = useState('')

  return (
    <Layout className={classes.root}>
      <Box>
        <h1>Sign in</h1>
        <p>Stay updated on your professional world.</p>
        <form>
          <Input
            type="email"
            id="email"
            label="Email"
            onFocus={() => setErrorMessage('')}
          />
          <Input
            type="password"
            id="password"
            label="Password"
            onFocus={() => setErrorMessage('')}
          />
          {errorMessage && <p className={classes.error}>{errorMessage}</p>}

          <Button type="submit">Sign in</Button>
          <Link to="/request-password-reset">Forgot password?</Link>
        </form>
        <Seperator>Or</Seperator>
        <div className={classes.register}>
          New to LinkedIn? <Link to="/signup">Join now</Link>
        </div>
      </Box>
    </Layout>
  )
}
