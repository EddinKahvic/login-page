import classes from './ResetPassword.module.scss'
import { Box } from '../../components/box/Box'
import { Layout } from '../../components/layout/Layout'
import { Input } from '../../components/input/Input'
import { Button } from '../../components/button/Button'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export function ResetPassword() {
  const navigate = useNavigate()
  const [emailSent, setEmailSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState(' ')
  return (
    <Layout className={classes.root}>
      <Box>
        <h1>Reset password</h1>
        {!emailSent ? (
          <form action="">
            <p>
              Enter your email and we'll send you a verification code if it
              matches an existing LinkedIn account.
            </p>
            <Input type="email" name="email" id="email" label="Email" />
            <p style={{ color: 'red' }}>{errorMessage}</p>
            <Button type="submit">Next</Button>
            <Button
              type="button"
              outline
              onClick={() => {
                navigate('/login')
              }}
            >
              Back
            </Button>
          </form>
        ) : (
          <form action="">
            <p>
              Enter the verification code we sent to your email and your new
              password.
            </p>
            <Input
              type="text"
              name="code"
              id="code"
              label="Verification code"
            />
            <Input
              type="password"
              name="password"
              id="password"
              key="password"
              label="New Password"
            />
            <p style={{ color: 'red' }}>{errorMessage}</p>
            <Button type="submit">Reset password</Button>
            <Button
              type="button"
              outline
              onClick={() => {
                setEmailSent(false)
              }}
            >
              Back
            </Button>
          </form>
        )}
      </Box>
    </Layout>
  )
}
