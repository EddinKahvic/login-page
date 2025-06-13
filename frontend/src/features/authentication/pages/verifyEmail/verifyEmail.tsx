import { useState } from 'react'
import { Box } from '../../components/box/Box'
import { Input } from '../../components/input/Input'
import { Layout } from '../../components/layout/Layout'
import classes from './VerifyEmail.module.scss'
import { Button } from '../../components/button/Button'

export function VerifyEmail() {
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  return (
    <Layout className={classes.root}>
      <Box>
        <h1>Verify your email</h1>
        <form>
          <p>
            Only one step left to complete your registration. Verify your email
            address.
          </p>
          <Input type="text" name="code" key="code" label="Verification code" />
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <Button type="submit">Validate email</Button>
          <Button type="button" outline>
            Send again
          </Button>
        </form>
      </Box>
    </Layout>
  )
}
