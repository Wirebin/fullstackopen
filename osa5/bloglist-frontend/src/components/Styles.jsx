import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Button = styled.button`
  background-color: #008ddf;
  color: white;
  padding: 0.6em 1.1em;
  font-size: 1.2em;
  margin: 0.6em 0;
  border-radius: 0.2em;
  border: 0;
  box-shadow: 0em 0.1em 0.2em black;
  &:hover {
    background-color: #0067a3
  }
`

const LogoutButton = styled.button`
  font-size: 1.4em;
  background: none;
  margin: 0 0.2em;
  border: 0;
  color: white;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

const LoginInput = styled.input`
  border: none;
  border-bottom: 0.2em solid #bbbbbb;
  padding: 0.8em;
  font-size: 0.9em;
  &:focus {
    outline: none;
    border-color: rgb(0, 60, 139);
  }
`

const FormInput = styled.input`
  border: none;
  border: 0.2em solid #bbbbbb;
  border-radius: 0.4em;
  padding: 0.8em;
  margin: 0.45em 0;
  font-size: 0.9em;
  &:focus {
    outline: none;
    border-color: rgb(0, 60, 139);
  }
`

const StyleLink = styled(Link)`
  margin: 0.4em;
  font-size: 1.6em;
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #007add;
  color: white;
  padding: 1.2em;
`

const NavLeft = styled.h1`
  margin: 0;
`

const NavRight = styled.div`
  display: flex;
  align-items: center;
`

const Card = styled.div`
  padding: 0.2em 1.2em;
  margin: 1em 0;
  box-shadow: 0 0.05em 0.16em black;
  border-radius: 0.2em;
`

const GrayText = styled.div`
  color: #424242;
  margin: 0.2em 0;
`

const LikeButton = styled.button`
  background: none;
  border-color: #21a6ff;
  color: #21a6ff;
  font-size: 1.2em;
  border-radius: 0.4em;
  padding: 0.6em 0.8em;
  margin: 0.4em;
  &:hover {
    background-color: #e6e6e6;
  }
`

const RemoveButton = styled.button`
  background: none;
  border-color: #ff2121;
  color: #ff2121;
  font-size: 1.2em;
  border-radius: 0.4em;
  padding: 0.6em 0.8em;
  margin: 0.4em;
  &:hover {
    background-color: #e6e6e6;
  }
`

export { Button, LogoutButton, LoginInput, FormInput, StyleLink, NavBar, NavLeft, NavRight, Card, GrayText, LikeButton, RemoveButton }