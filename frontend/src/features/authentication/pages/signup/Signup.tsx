import { Link, useNavigate } from 'react-router-dom'
import { Box } from '../../components/box/Box'
import { Button } from '../../components/button/Button'
import { Input } from '../../components/input/Input'
import { Layout } from '../../components/layout/Layout'
import { Seperator } from '../../components/seperator/Seperator'
import classes from './Signup.module.scss'
import { useState, type FormEvent } from 'react'
import { useAuthentication } from '../../context/AuthenticationContextProvider'

export function Signup() {
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuthentication()
  const navigate = useNavigate()

  const doSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value
    try {
      await signup(email, password)
      navigate('/')
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('An unknown error occurred.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout className={classes.root}>
      <Box>
        <h1>Sign Up</h1>
        <p>Make the most of your professional life.</p>
        <form onSubmit={doSignup}>
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
          <p className={classes.disclaimer}>
            By clicking Agree & Join or Continue, you agree to LinkedIn's{' '}
            <a href="">User Agreement</a>, <a href="">Privacy Policy</a>, and{' '}
            <a href="">Cookie Policy</a>
          </p>
          <Button type="submit" disabled={isLoading}>
            Agree & Join
          </Button>
        </form>
        <Seperator>Or</Seperator>
        <div className={classes.register}>
          Already on LinkedIn? <Link to="/login">Sign in</Link>
        </div>
      </Box>
    </Layout>
  )
}
