import { Link } from 'react-router-dom'
import { Box } from '../../components/box/Box'
import { Button } from '../../components/button/Button'
import { Input } from '../../components/input/Input'
import { Layout } from '../../components/layout/Layout'
import { Seperator } from '../../components/seperator/Seperator'
import classes from './Signup.module.scss'
import { useState } from 'react'

export function Signup() {
  const [errorMessage, setErrorMessage] = useState('')

  return (
    <Layout className={classes.root}>
      <Box>
        <h1>Sign Up</h1>
        <p>Make the most of your professional life.</p>
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
          <p className={classes.disclaimer}>
            By clicking Agree & Join or Continue, you agree to LinkedIn's{' '}
            <a href="">User Agreement</a>, <a href="">Privacy Policy</a>, and{' '}
            <a href="">Cookie Policy</a>
          </p>
          <Button type="submit">Agree & Join</Button>
        </form>
        <Seperator>Or</Seperator>
        <div className={classes.register}>
          Already on LinkedIn? <Link to="/login">Sign in</Link>
        </div>
      </Box>
    </Layout>
  )
}
