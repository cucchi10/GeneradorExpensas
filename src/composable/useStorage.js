
import {  ref } from "@vue/reactivity";

import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster();

import html2pdf from 'html2pdf.js';

import {saveAs} from 'file-saver';

const meses = ['Enero','Febrero' ,'Marzo' ,'Abril' ,'Mayo' ,'Junio' ,'Julio' ,'Agosto' ,'Julio' ,'Agosto' ,'Septiembre' ,'Octubre' ,'Noviembre' ,'Diciembre']

export default function useStorage(SendPagoResult){

  
    const refTxt =ref(null)

    const datos_session = ref(false)
    
    const archive_txt_result = ref(null)

    const doLocaleStorage = (deptos, edificio, valueMonth) => {
      try{
      const deuda_depto = [] // aca pusheo el a_pagar
      const saldo_favor = [] // aca pusheo el new_saldo_favor
      const saldo_anterior_fondo_edificio = edificio.saldo_al_cierre
      const mesValue = valueMonth
      
      if(mesValue === 'Seleccione un Mes'){
        return toaster.error(`Para Guardar Datos en Session, Seleccione un mes`,{position: 'top-right'});
      }
      const findIndexMonth = meses.findIndex(x=> x === mesValue )
      if (!findIndexMonth) {return toaster.error(`Me la quisiste Bugear, Seleccione un mes`,{position: 'top-right'});}

      let selectLaterMonth = null
      if(!meses[findIndexMonth+1]){
        selectLaterMonth = meses[0]
      }else{
        selectLaterMonth = meses[findIndexMonth+1]
      }

      localStorage.setItem('valueMonth', JSON.stringify(selectLaterMonth))

      if (saldo_anterior_fondo_edificio){
        localStorage.setItem('edificio.saldo_anterior_fondo_edificio', JSON.stringify(edificio.saldo_al_cierre.toFixed(2)))
      }else{
        localStorage.setItem('edificio.saldo_anterior_fondo_edificio', '0.00')
      }

      if(Object.values(deptos)){
          Object.values(deptos).forEach(x=>{
            if(x.a_pagar_total){deuda_depto.push(x.a_pagar_total.toFixed(2))}else{deuda_depto.push('0.00')}
            if(x.new_saldo_favor){saldo_favor.push(x.new_saldo_favor.toFixed(2))}else{saldo_favor.push('0.00')}
          })
        localStorage.setItem('deuda_depto', JSON.stringify(deuda_depto))
        localStorage.setItem('saldo_favor', JSON.stringify(saldo_favor))
      }
      return toaster.success(`Datos en Session Guardados`), datos_session.value = true
    } catch (error){
      toaster.error(`Error Al Guardar Session - ${error}`,{position: 'top-right'})
       setTimeout(()=>{
        deleteLocaleStorage()
        return location.reload()
      },700)
    }
  }

  const setLocaleStorage = (deptos, edificio, valueMonth) => {
    try{
      let value = localStorage.length;
      if(!value){
        return toaster.error(`No Hay Datos en Session, Importa un Documento`,{position: 'top-right'});
      }

      const mesValue =  JSON.parse(localStorage?.getItem('valueMonth'))
      const saldo_anterior_fondo_edificio = Number(JSON.parse(localStorage?.getItem('edificio.saldo_anterior_fondo_edificio')))
      const deuda_depto = JSON.parse(localStorage?.getItem('deuda_depto'))
      const saldo_favor = JSON.parse(localStorage?.getItem('saldo_favor'))

      let findMonth = null
      if(mesValue){
      findMonth = meses.find(x=> x === mesValue )
        if(findMonth){
          valueMonth.value = mesValue
        }
      }
      if(saldo_anterior_fondo_edificio){
        edificio.saldo_anterior_fondo_edificio = saldo_anterior_fondo_edificio
      }
      if(Object.values(deptos).length){
        Object.values(deptos).map((x, i)=>{
        x.deuda_depto = Number(deuda_depto[i]),
        x.saldo_favor = Number(saldo_favor[i])
      }) 
      }
    if(!findMonth){
      return toaster.error(`No Tiene Mes Guardado, Se Recomienda Borrar Datos en Session`, {position: 'top-right'}),datos_session.value = true
      }
      return toaster.success(`Datos en Session Actualizados`),datos_session.value = true
    }catch (error){
       toaster.error(`Error Al Cargar Session - ${error}`,{position: 'top-right'})
       setTimeout(()=>{
        deleteLocaleStorage()
        return location.reload()
      },700)
    }
  }

  const deleteLocaleStorage = () => {
    localStorage.clear()
    toaster.error(`Elimino los Datos en Session`, {position: 'top-right'})
    return datos_session.value = false
  }


  const uploadTxt = async (deptos, edificio, valueMonth) => {
 
    try{
      let archive_txt = refTxt.value.files[0]
      if(!archive_txt){return toaster.error(`Error Al Cargar el Archivo`,{position: 'top-left'}); }

      const reader = new FileReader();
      archive_txt_result.value = await new Promise((resolve)=>{
        
          reader.onload =  () => {
            resolve(reader.result);
          }
          reader.readAsText(archive_txt);
      })
      if(!archive_txt_result.value){return toaster.error(`Error Al Leer el Archivo`,{position: 'top-left'}); }

      const valores_txt = JSON.parse(archive_txt_result.value)

      if(!valores_txt){
        return toaster.error(`No Hay Datos en Session Importados`,{position: 'top-right'});
      }

      //Borramos el Viejo Storage
      localStorage.clear()

      localStorage.setItem('valueMonth',valores_txt.mesValue)
      localStorage.setItem('edificio.saldo_anterior_fondo_edificio',valores_txt.saldo_anterior_fondo_edificio)
      localStorage.setItem('deuda_depto',valores_txt.deuda_depto)
      localStorage.setItem('saldo_favor',valores_txt.saldo_favor)
        
      toaster.success(`Datos Actualizados Correctamente, Se Aplicaran los Cambios`)
        
      setTimeout(()=>{
        return location.reload()
      },600)
    } catch (error){
      toaster.error(`Error Al Cargar Session - ${error}`,{position: 'top-right'})
      setTimeout(()=>{
        deleteLocaleStorage()
        return location.reload()
      },700)
    }
  }

  const downloadTxt = (valueMonth) =>{
    try{
      const data = {}
      data.mesValue =  localStorage.getItem('valueMonth')
      data.saldo_anterior_fondo_edificio =  localStorage.getItem('edificio.saldo_anterior_fondo_edificio')
      data.deuda_depto =  localStorage.getItem('deuda_depto')
      data.saldo_favor = localStorage.getItem('saldo_favor')

      const file = new File([JSON.stringify(data)], `Data_Session_Expensas_${valueMonth}.txt`, {type: "text/plain"});

      saveAs(file);
    } catch (error){
      toaster.error(`Error Al Descargar Session - ${error}`,{position: 'top-right'});
      setTimeout(()=>{
        deleteLocaleStorage()
        return location.reload()
      },700)
    }
    
  }

  const doExportPDF = (item, month) => {
    try{
      if(!Object.values(item).length){
        return toaster.error('Selecciona un Departamento en la Tabla',{position: 'bottom'});
      }
      if(month === 'Seleccione un Mes'){
        return toaster.error('Selecciona un Mes',{position: 'top'});
      }
      let depto = item.index
      let mes = month

      
      let element = document.getElementById('ExpensasPDF');
      element.classList.add('class-pdf');
      
      let opt = {
        margin:       0.6,
        filename:     `Expensas_${mes}_${depto}.pdf`,
        image:        { type: 'jpg', quality: 0.9 },
        html2canvas:  { scale: 2  },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait',compressPDF: false },
        pagebreak: {mode: ['avoid-all']}
      };

      let title = document.getElementById('TittlePdf');
      title.classList.remove('class-title-pdf');

      html2pdf().from(element).set(opt).save().finally(()=>{element.classList.remove('class-pdf'),  title.classList.add('class-title-pdf')});
    } catch (error){
      toaster.error(`Error Al Generar PDF - ${error}`,{position: 'top-right'});
    } 
  }
      
  const SendPagoStorage = (value, depto,index,deptos)=>{
    try{
      
      const deuda_depto = []
      const saldo_favor = []

      JSON.parse(localStorage?.getItem('deuda_depto')).forEach(d=>deuda_depto.push(Number(d)))
      
      JSON.parse(localStorage?.getItem('saldo_favor')).forEach(s=>saldo_favor.push(Number(s)))


      let deuda_depto_value = 0
      let saldo_favor_value = 0

      let valor = 0
      valor = Number((deuda_depto[index]-value).toFixed(2))

      if(Math.sign(valor) === 0 || Math.sign(valor) === 1){
        deuda_depto_value= valor, saldo_favor_value = saldo_favor[index]
        return SendPagoResult({deuda_depto_value,saldo_favor_value,index: depto,deptos})
        
      }else if (Math.sign(valor) === -0 ||Math.sign(valor) === -1){
        deuda_depto_value= 0, saldo_favor_value =( saldo_favor[index]+(valor*-1))
        return SendPagoResult({deuda_depto_value,saldo_favor_value,index:depto,deptos})
      }
      return toaster.error(`Error Al Cargar Pagos de ${depto.replace('_',' ')}`,{position: 'top-right'});
    } catch (error){
      toaster.error(`Error Al Cargar Pagos - ${error}`,{position: 'top-right'});
      setTimeout(()=>{
        deleteLocaleStorage()
        return location.reload()
      },700)
    }
    
  }

  return{
    datos_session,
    doLocaleStorage,
    setLocaleStorage,
    deleteLocaleStorage,
    uploadTxt,
    refTxt,
    downloadTxt,
    doExportPDF,
    SendPagoStorage,
  }
}