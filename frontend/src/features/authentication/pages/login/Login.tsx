import classes from './Login.module.scss'
import { Layout } from '../../components/layout/Layout'
import { useState, type FormEvent } from 'react'
import { Box } from '../../components/box/Box'
import { Input } from '../../components/input/Input'
import { Button } from '../../components/button/Button'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Seperator } from '../../components/seperator/Seperator'
import { useAuthentication } from '../../context/AuthenticationContextProvider'

export function Login() {
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthentication()
  const navigate = useNavigate()
  const location = useLocation()

  const doLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value

    try {
      await login(email, password)
      const destination = location.state?.from || '/'
      navigate(destination)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('An unknown error occured.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout className={classes.root}>
      <Box>
        <h1>Sign in</h1>
        <p>Stay updated on your professional world.</p>
        <form onSubmit={doLogin}>
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

          <Button type="submit" disabled={isLoading}>
            {isLoading ? '...' : 'Sign in'}
          </Button>
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
