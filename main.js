import {preguntas} from './data/preguntas.js'
import Respuesta from './modules/respuesta.js'

const scriptURL = 'https://script.google.com/macros/s/AKfycbxzAZmzBr9U1TfQ5sDHjYczE2MLdb3xF5yuXoWXUNR0qJsjSd0yeIBYQiszdKtaxiTU/exec'
const div = document.getElementById('quiz')
let i = 0
const form = []

const handleForm = (formEnviar) =>{
    const button = document.createElement('button')
    button.type = 'submit'
    button.id = 'formulario'
    formEnviar.style = 'display:none'
    formEnviar.appendChild(button)
    div.appendChild(formEnviar)
    console.log(formEnviar)
    formEnviar.addEventListener('submit', e => {
        e.preventDefault()
        console.log('submit')
        fetch(scriptURL, { method: 'POST', body: new FormData(formEnviar)})
          .then(response => console.log('Success!', response))
          .catch(error => console.error('Error!', error.message))
      })

    button.click()
}

const renderPregunta = (obj,cond) =>{
        console.log(obj)

        if(cond == 'sig'){
            return(
                `
                <hr />
                <h1 id="question">${obj.pregunta}</h1>
                <div id="choices">
                <textarea id=${obj.id} name="${obj.name.toUpperCase()}" class="form-control" style="width: 80%"></textarea>
                </div>
                <hr style="margin-top: 50px" />
        
                `
                )
        }else{
            return(
                `
                <hr />
                <h1 id="question">${obj.pregunta}</h1>
                <div id="choices">
                <textarea id=${obj.id} name="${obj.name.toUpperCase()}" class="form-control" style="width: 80%">${form[i-1].input}</textarea>
                </div>
                <hr style="margin-top: 50px" />
        
                `
            )
        }

       
}

const handleRenderPregunta = (cond) =>{
    
    if (cond == 'sig') {
        console.log(i)
        console.log(preguntas.length)
        if (i >= preguntas.length - 1) {
            div.innerHTML = '<h2>Gracias por responder nuestro formulario</h2>'
            renderFooter(i,preguntas.length-1)
            renderForm()
        } else {
            i++
            div.innerHTML = ''
            div.innerHTML = renderPregunta(preguntas[i],'sig')
            renderFooter(i,preguntas.length-1)
            handleEventSig(preguntas[i].id)
            
        }

    }else{
        console.log(i)
        i--
        renderFooter(i,preguntas.length)
        div.innerHTML = ''
        div.innerHTML = renderPregunta(preguntas[i],'ant')
        handleEventSig(preguntas[i].id)
        
        

    }

    
}


const renderForm = () =>{
    const htmlForm = document.createElement('form')
    htmlForm.name = "submit-to-google-sheet"
    let inputs = document.createElement('div')
    form.forEach(element =>{
        inputs.innerHTML += `
        <label>${element.label}</label>
        <input name=${element.name} value=${element.input} />
        `
        htmlForm.appendChild(inputs)
    })
    handleForm(htmlForm)


    
}

const handleEventSig = (id)=>{
    document.getElementById('anterior').addEventListener('click', ()=>{
        if(i==1){
            alert('Estas en la primera pregunta')
        }else{
            handleRenderPregunta('anterior')
        }
    })

    document.getElementById('continuar').addEventListener('click',()=>{
        const respuesta = document.getElementById(id).value
        const name = document.getElementById(id).name
        const preg = document.getElementById('question').textContent
        
        if(respuesta.length == 0){
            alert('Debe llenar todos los campos')
        }else{
            saveForm(preg,respuesta,name,'sig')
            handleRenderPregunta('sig')
        }
        
    })
}


const renderFooter = (numPreguntas, totalPreguntas) =>{

    if(numPreguntas > totalPreguntas){
        document.getElementById('footer-quiz').innerHTML =`
        <p>Fin</p>
        `
    }else{
        document.getElementById('footer-quiz').innerHTML = `
        <p id="progress">Questions ${numPreguntas} of ${totalPreguntas}</p>
        <div>
        <button id="anterior">Anterior</button>
        <button id="continuar">Siguiente</button>
        </div>
        `
    }
}

const saveForm = (label,input,name,cond) =>{
    let response = new Respuesta(label,input,name)
    form.push(response)
}

document.getElementById('empezar').addEventListener('click', ()=>{
    handleRenderPregunta('sig')
})
