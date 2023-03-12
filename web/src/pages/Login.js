import React from 'react'

function Login() {
  return (
    <div>
      <h1 id="myHeader" class="textcolor" >Posedee</h1>
            <a class="log" href="http://127.0.0.1:5000/Oauth">
                <button>Login with Google</button>
            </a>
        <h5 class="textcolor" style={{margin: 0}}>Do you have an account?</h5>
        <a class="textcolor" style={{margin: 0}} href="https://accounts.google.com/v3/signin/identifier?dsh=S-938716802%3A1678190622213548&continue=https%3A%2F%2Fwww.google.com%3Fhl%3Den-US&ec=GAlA8wE&hl=en&flowName=GlifWebSignIn&flowEntry=AddSession">Create account</a>
    </div>

    
  )
}

export default Login