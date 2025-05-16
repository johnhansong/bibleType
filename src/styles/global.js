import {createGlobalStyle} from 'styled-components'


export const GlobalStyles = createGlobalStyle`

*{
  box-sizing: border-box;
}

body {
  background: ${({theme}) => theme.background};
  color: ${({theme}) => theme.textColor};
  margin: 0;
  padding: 0;
  transition: all 0.25s linear;
}

.type-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.canvas{
  display: grid;
  min-height: 100vh;
  grid-auto-flow: row;
  grid-template-rows: auto 1fr auto;
  gap: 0.5rem;
  padding: 0 2rem 2rem 2rem;
  width: 100vw;
  align-items: center;
  text-align: center;
}

.type-box{
  display: block;
  max-width: 900px;
  min-height: 140px;
  height: auto;
  margin: 0;
}

.blurred {
  filter: blur(5px);
  transition: filter 0.3s ease;
}

.overlay {
  position: absolute;
  top: 8%;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.overlay-text {
  font-size: 32px;
  color: ${({theme}) => theme.textColor};
  opacity: 100%;
}

.words{
  font-size: 28px;
  display: flex;
  flex-wrap: wrap;
  color: ${({theme}) => theme.typeBoxText}
}

.word{
  margin: 5px;
  padding-right: 2px;
}

.hidden-input{
  opacity: 0;
}

.current{
  border-left: 2px solid;
  animation: blinking 2s infinite;
  @keyframes blinking{
    0% {border-left-color: ${({theme}) => theme.accent};}
    25% {border-left-color: ${({theme}) => theme.background};}
    50% {border-left-color: ${({theme}) => theme.accent};}
    75% {border-left-color: ${({theme}) => theme.background};}
    100% {border-left-color: ${({theme}) => theme.accent};}
  }
}

.current-right{
  border-right: 2px solid;
  animation: blinkingRight 2s infinite;
  @keyframes blinkingRight{
    0% {border-right-color: ${({theme}) => theme.accent};}
    25% {border-right-color: ${({theme}) => theme.background};}
    50% {border-right-color: ${({theme}) => theme.accent};}
    75% {border-right-color: ${({theme}) => theme.background};}
    100% {border-right-color: ${({theme}) => theme.accent};}
  }
}


.correct{
  color: ${({theme}) => theme.textColor};
}

.incorrect{
  color: ${({theme}) => theme.incorrect};
}

.counter {
  display: flex;
  padding: 5px;
  font-size: 26px;
}

.footer {
  width: 1000px;
  display: flex;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
}

.stats-box {
  display: flex;
  width: 1000px;
  height: auto;
  margin-left: auto;
  margin-right: auto;
}

.left-stats {
  width: 30%;
  padding: 30px;
}

.right-stats {
  width: 70%;
}

.title {
  font-size: 20px;
  color: ${({theme}) => theme.accent}
}

.subtitle {
  font-size: 26px;
}

.header {
  width: 1000px;
  display: flex;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-text {
  margin-left: 15px;
  font-size: 26px;
  color: ${({theme}) => theme.textColor}
}

.user-profile {
  width: 1000px;
  margin: auto;
  margin-bottom: 10px;
  display: flex;
  height: 12rem;
  background: ${({theme}) => theme.typeBoxText};
  border-radius: 20px;
  padding: 1.25rem;
  justify-content: center;
  align-text: center;
}

.user {
  width: 50%;
  display: flex;
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 1.25rem;
  padding: 1rem;
  border-right: 2px solid;
}

.info {
  width: 60%;
  padding: 1rem;
}

.picture {
  width: 40%
}

.total-tests {
  width: 50%;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table, .graph-user-page {
  margin: auto;
  width: 1000px;
}

.upper-menu {
  border: 2px solid ${({theme}) => theme.typeBoxText};
  border-radius: 5px;
}

.mode:hover{
  cursor: pointer;
  color: ${({theme}) => theme.typeBoxText};
}

.selected_mode {
  color: ${({theme}) => theme.accent}
}
`

// Index:
// vh = ViewHeight
// vw = ViewWidth
