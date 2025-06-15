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
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState()

  const sendPasswordResetToken = async (email: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }api/v1/authentication/send-password-reset-token?email=${email}`,
        {
          method: 'PUT',
        }
      )
      if (response.ok) {
        setErrorMessage('')
        setEmailSent(true)
        return
      }
      const { message } = await response.json()
      setErrorMessage(message)
    } catch (error) {
      console.log(error)
      setErrorMessage('Something went wrong, please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (
    email: string,
    code: string,
    password: string
  ) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }api/v1/authentication/reset-password?email=${email}&token=${code}&newPassword=${password}`,
        {
          method: 'PUT',
        }
      )
      if (response.ok) {
        setErrorMessage('')
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
      setErrorMessage('Something went wrong, please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout className={classes.root}>
      <Box>
        <h1>Reset password</h1>
        {!emailSent ? (
          <form
            key="email-form"
            onSubmit={async (e) => {
              e.preventDefault()
              setIsLoading(true)
              const email = e.currentTarget.email.value
              await sendPasswordResetToken(email)
              setEmail(email)
              setIsLoading(false)
            }}
          >
            <p>
              Enter your email and we'll send you a verification code if it
              matches an existing LinkedIn account.
            </p>
            <Input type="email" name="email" id="email" label="Email" />
            <p style={{ color: 'red' }}>{errorMessage}</p>
            <Button type="submit" disabled={isLoading}>
              Next
            </Button>
            <Button
              type="button"
              outline
              onClick={() => {
                navigate('/login')
              }}
              disabled={isLoading}
            >
              Back
            </Button>
          </form>
        ) : (
          <form
            key="code-form"
            onSubmit={async (e) => {
              e.preventDefault()
              setIsLoading(true)
              const code = e.currentTarget.code.value
              const password = e.currentTarget.password.value
              await resetPassword(email, code, password)
              setIsLoading(false)
            }}
          >
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '...' : 'Reset Password'}
            </Button>
            <Button
              type="button"
              outline
              onClick={() => {
                setErrorMessage('')
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
