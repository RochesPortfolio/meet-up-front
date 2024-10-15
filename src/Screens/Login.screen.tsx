import React, { CSSProperties } from 'react'
import GoogleLoginButton from '../components/GoogleLoginButton'
import colors from '../styles/colors'
import { observer } from 'mobx-react'
import store from '../store';
import whiteLogo from '../assets/icons/whiteLogo.png'
const LoginScreen = observer(() => {

  const LoginRightCard = (): JSX.Element => {
    return (
      <div style={$loginLeftCard}>
        <p>{"Crea o Inicia Sesion con: "}</p>
        <GoogleLoginButton />
        <p>
          { }
        </p>
      </div>
    )

  }
  const LoginLeftCard = (): JSX.Element => {
    return <div style={$loginRightCard}>
      <div style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        width: '100%',
      }}>
        <div>
          <img src={whiteLogo} alt="Google Logo" style={{
            width: '50%',
            objectFit: 'contain',
            margin:0,
            padding:0,
          }} />
          <h1 style={{ color: '#ffffff', fontSize: 50, fontWeight:"bold" }} >MeetUp<br/>Prototype</h1>
        </div>
      </div>
    </div>

  }


  const LoginCard = (): JSX.Element => {
    return <div style={$loginCard}>
      <LoginRightCard />
      <LoginLeftCard />
    </div>
  }



  return (
    <div style={$loginContainer}>

      <LoginCard />
    </div>
  )
}
);

export default LoginScreen

const $loginContainer: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  backgroundColor: colors.palette.whiteBackground,
  boxShadow: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)"
}

const $loginCard: CSSProperties = {
  backgroundColor: 'white',
  height: '75vh',
  width: '70vw',
  borderRadius: '10px',
  flexDirection: 'row',
  display: 'flex',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)', // Agrega esta línea para la sombra inferior

}

const $loginLeftCard: CSSProperties = {
  backgroundColor: colors.palette.white,
  height: '100%',
  width: '50%',
  borderRadius: '10px 0px 0px 10px',
  position: 'relative',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',

}
const $loginRightCard: CSSProperties = {
  backgroundColor: colors.palette.primaryYellow,
  height: '100%',
  width: '50%',
  borderRadius: '0px 10px 10px 0px',
  position: 'relative',
}
