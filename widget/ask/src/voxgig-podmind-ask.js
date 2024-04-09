
import { store, component, render, signal } from 'reefjs'

import CSS from './voxgig-podmind-ask.css?inline'

const NAME = 'voxgig-podmind-ask'

function debug(...args) { console.log(NAME,...args) }


class VoxgigPodmindAsk extends HTMLElement {
  constructor() {
    super()
    debug('START')

    this.uuid = crypto.randomUUID()

    this.store = {
      todolist: signal(['one','two'], this.uuid),
    }
  }

  connectedCallback() {
    debug('CONNECT')
    this.shadow = this.attachShadow({ mode: "open" })

    const style = document.createElement("style")
    style.innerHTML = CSS
    
    this.shadowRoot.appendChild(style)

    const elem = document.createElement("div")
    this.shadowRoot.appendChild(elem)    

    this.main(elem)
  }


  main(elem) {
    const self = this
    
    const events = {
      add: function(ev) {
        console.log('EVENT add', ev)
        const inputElem = self.shadowRoot.getElementById('tododesc')
        self.store.todolist.push(inputElem.value)
      }
    }

    function Main() {
      return `<div>
        <h1 class="voxgig-podmind-ask">TODO</h1>
        <input id="tododesc" />
        <button onclick="add()">add</button>
        ${TodoList()}
      </div>`
    }

    function TodoList() {
      return `<ul>
        ${self.store.todolist.map(entry=>`<li>
        ${entry}
        </li>`).join('')}
      </ul>`
    }

    
    component(elem, Main, {
      signals: [this.uuid],
      events,
    })
  }
}

customElements.define('voxgig-podmind-ask', VoxgigPodmindAsk)
