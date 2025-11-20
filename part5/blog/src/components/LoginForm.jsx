import { useState } from "react"

const LoginForm = () => {

    return (
      <form onSubmit={handleLogin}>
        <h1>log in to application</h1>
        <Notification message={message} />
        <div>
          <label>
            userName
            <input type='text' value={userName} onChange={({target}) => setUserName(target.value)}></input>
          </label>
        </div>
        <div>
          <label>
            password
            <input type='password' value={password} onChange={({target}) => setPassword(target.value)}></input>
          </label>
        </div>
        <div>
          <button type="submit">login</button>
        </div>
      </form>
    )
  }

export default LoginForm