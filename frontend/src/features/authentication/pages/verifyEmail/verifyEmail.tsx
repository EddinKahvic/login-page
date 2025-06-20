import { useState } from 'react'
import { Box } from '../../components/box/Box'
import { Input } from '../../components/input/Input'
import { Layout } from '../../components/layout/Layout'
import classes from './VerifyEmail.module.scss'
import { Button } from '../../components/button/Button'
import { useNavigate } from 'react-router-dom'

export function VerifyEmail() {
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const validateEmail = async (code: string) => {
    setMessage('')
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }api/v1/authentication/validate-email-verification-token?token=${code}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if (response.ok) {
        setErrorMessage('')
        navigate('/')
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

  const sendEmailVerificationToken = async () => {
    setErrorMessage('')
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }api/v1/authentication/send-email-verification-token`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      if (response.ok) {
        setErrorMessage('')
        setMessage('Code sent successfully. Please check your email.')
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

  return (
    <Layout className={classes.root}>
      <Box>
        <h1>Verify your email</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setIsLoading(true)
            const code = e.currentTarget.code.value
            await validateEmail(code)
            setIsLoading(false)
          }}
        >
          <p>
            Only one step left to complete your registration. Verify your email
            address.
          </p>
          <Input type="text" name="code" key="code" label="Verification code" />
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <Button type="submit" disabled={isLoading}>
            Validate email
          </Button>
          <Button
            type="button"
            outline
            disabled={isLoading}
            onClick={() => {
              sendEmailVerificationToken()
            }}
          >
            Send again
          </Button>
        </form>
      </Box>
    </Layout>
  )
}
