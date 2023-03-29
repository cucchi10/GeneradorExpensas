
import { ref } from "@vue/reactivity";
import XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';

import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster();



const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function useStorage(SendPagoResult, emit) {

  const deuda_depto = [] // aca pusheo el a_pagar
  const saldo_favor = [] // aca pusheo el new_saldo_favor

  const refTxt = ref(null)

  const datos_session = ref(false)

  const archive_txt_result = ref(null)

  const Loader = ref(true)

  const datos_act_session = ref(false)

  const setLoaderEmit = (value) => {
    emit('setLoaderEmit', value)
  }
  const setLoader = (value) => {
    Loader.value = value
  }

  const doLocaleStorage = (deptos, edificio, valueMonth) => {
    try {
      setLoaderEmit(true)

      const saldo_anterior_fondo_edificio = edificio.saldo_al_cierre
      const mesValue = valueMonth

      if (mesValue === 'Seleccione un Mes') {
        return toaster.error(`Para Guardar Datos en Session, Seleccione un mes`, { position: 'top-right' }), setLoaderEmit(false);
      }
      const findIndexMonth = meses.findIndex(x => x === mesValue)
      if (findIndexMonth === -1) { return toaster.error(`Me la quisiste Bugear, Seleccione un mes`, { position: 'top-right' }), setLoaderEmit(false) }

      let selectLaterMonth = null
      if (!meses[findIndexMonth + 1]) {
        selectLaterMonth = meses[0]
      } else {
        selectLaterMonth = meses[findIndexMonth + 1]
      }

      localStorage.setItem('valueMonth', JSON.stringify(selectLaterMonth))

      if (saldo_anterior_fondo_edificio) {
        localStorage.setItem('edificio.saldo_anterior_fondo_edificio', JSON.stringify(edificio.saldo_al_cierre.toFixed(2)))
      } else {
        localStorage.setItem('edificio.saldo_anterior_fondo_edificio', '0.00')
      }

      if (Object.values(deptos)) {
        Object.values(deptos).forEach(x => {
          if (x.a_pagar_total) { deuda_depto.push(x.a_pagar_total.toFixed(2)) } else { deuda_depto.push('0.00') }
          if (x.new_saldo_favor) { saldo_favor.push(x.new_saldo_favor.toFixed(2)) } else { saldo_favor.push('0.00') }
        })
        localStorage.setItem('deuda_depto', JSON.stringify(deuda_depto))
        localStorage.setItem('saldo_favor', JSON.stringify(saldo_favor))
      }
      return toaster.success(`Datos en Session Guardados`), datos_session.value = true, datos_act_session.value = true, setLoaderEmit(false)
    } catch (error) {
      setLoaderEmit(false)
      toaster.error(`Error Al Guardar Session - ${error}`, { position: 'top-right' })
      setTimeout(() => {
        deleteLocaleStorage()
        return location.reload()
      }, 700)
    }
  }

  const setLocaleStorage = (deptos, edificio, setValueMonth) => {
    try {
      setLoaderEmit(true)
      let value = localStorage.length;
      if (!value) {
        return toaster.error(`No Hay Datos en Session, Importa un Documento`, { position: 'top-right' }), setLoaderEmit(false);
      }

      const mesValue = JSON.parse(localStorage.getItem('valueMonth'))
      const saldo_anterior_fondo_edificio = Number(JSON.parse(localStorage.getItem('edificio.saldo_anterior_fondo_edificio')))
      const deuda_depto = JSON.parse(localStorage.getItem('deuda_depto'))
      const saldo_favor = JSON.parse(localStorage.getItem('saldo_favor'))

      let findMonth = null
      if (mesValue) {
        findMonth = meses.find(x => x === mesValue)
        if (findMonth) {
          setValueMonth(mesValue)
        }
      }
      if (saldo_anterior_fondo_edificio) {
        edificio.saldo_anterior_fondo_edificio = saldo_anterior_fondo_edificio
      }
      if (Object.values(deptos).length) {
        Object.values(deptos).map((x, i) => {
          x.deuda_depto = Number(deuda_depto[i]),
            x.saldo_favor = Number(saldo_favor[i])
        })
      }
      if (!findMonth) {
        return toaster.error(`No Tiene Mes Guardado, Se Recomienda Borrar Datos en Session`, { position: 'top-right' }), datos_session.value = true,
          setLoaderEmit(false)
      }
      return toaster.success(`Datos en Session Actualizados`), datos_session.value = true,
        setLoaderEmit(false)
    } catch (error) {
      setLoaderEmit(false)
      toaster.error(`Error Al Cargar Session - ${error}`, { position: 'top-right' })
      setTimeout(() => {
        deleteLocaleStorage()
        return location.reload()
      }, 700)
    }
  }

  const deleteLocaleStorage = () => {
    setLoaderEmit(true)
    localStorage.clear()
    toaster.error(`Elimino los Datos en Session`, { position: 'top-right' })
    return datos_session.value = false, setLoaderEmit(false)
  }


  const uploadTxt = async (deptos, edificio, setValueMonth) => {

    try {
      setLoaderEmit(true)
      let archive_txt = refTxt.value.files[0]
      if (!archive_txt) { return toaster.error(`Error Al Cargar el Archivo`, { position: 'top-left' }), setLoaderEmit(false); }

      const reader = new FileReader();
      archive_txt_result.value = await new Promise((resolve) => {

        reader.onload = () => {
          resolve(reader.result);
        }
        reader.readAsText(archive_txt);
      })
      if (!archive_txt_result.value) { return toaster.error(`Error Al Leer el Archivo`, { position: 'top-left' }), setLoaderEmit(false); }

      const valores_txt = JSON.parse(archive_txt_result.value)

      if (!valores_txt) {
        return toaster.error(`No Hay Datos en Session Importados`, { position: 'top-right' }), setLoaderEmit(false);
      }

      //Borramos el Viejo Storage
      localStorage.clear()

      localStorage.setItem('valueMonth', valores_txt.mesValue)
      localStorage.setItem('edificio.saldo_anterior_fondo_edificio', valores_txt.saldo_anterior_fondo_edificio)
      localStorage.setItem('deuda_depto', valores_txt.deuda_depto)
      localStorage.setItem('saldo_favor', valores_txt.saldo_favor)

      toaster.success(`Datos Leidos Correctamente, Se Aplicaran los Cambios`)

      setTimeout(() => {
        return setLocaleStorage(deptos, edificio, setValueMonth)
      }, 500)
    } catch (error) {
      setLoaderEmit(false)
      toaster.error(`Error Al Cargar Session - ${error}`, { position: 'top-right' })
      setTimeout(() => {
        deleteLocaleStorage()
        return location.reload()
      }, 700)
    }
  }

  const downloadTxt = (valueMonth, deptos) => {
    try {
      setLoaderEmit(true)
      let Year = new Date().getFullYear()
      if (month === 'Enero' && new Date().getMonth() === 11) {
        Year++
      } else if (month === 'Diciembre' && new Date().getMonth() === 0) {
        Year--
      }

      let text = `Data_Session_Expensas_${valueMonth}_${Year}.txt`
      const data = {}
      data.mesValue = localStorage.getItem('valueMonth')
      data.saldo_anterior_fondo_edificio = localStorage.getItem('edificio.saldo_anterior_fondo_edificio')
      data.deuda_depto = localStorage.getItem('deuda_depto')
      data.saldo_favor = localStorage.getItem('saldo_favor')

      if (deptos) {
        data.deptos = {};
        Object.entries(deptos).forEach(([key, value]) =>
          data.deptos[key] = value.pago
        );
        text = `Data_Pagos_Expensas_${valueMonth}_${Year}.txt`
      }

      const file = new File([JSON.stringify(data)], text, { type: "text/plain" });

      saveAs(file);
      setLoaderEmit(false)
    } catch (error) {
      setLoaderEmit(false)
      toaster.error(`Error Al Descargar Session - ${error}`, { position: 'top-right' });
      setTimeout(() => {
        deleteLocaleStorage()
        return location.reload()
      }, 700)
    }

  }

  const uploadTxtPagos = async (deptos) => {
    try {
      setLoaderEmit(true)
      let archive_txt = refTxt.value.files[0]
      if (!archive_txt) { return toaster.error(`Error Al Cargar el Archivo`, { position: 'top-left' }), setLoaderEmit(false); }

      const reader = new FileReader();
      archive_txt_result.value = await new Promise((resolve) => {

        reader.onload = () => {
          resolve(reader.result);
        }
        reader.readAsText(archive_txt);
      })
      if (!archive_txt_result.value) { return toaster.error(`Error Al Leer el Archivo`, { position: 'top-left' }), setLoaderEmit(false); }

      const deptos_txt = JSON.parse(archive_txt_result.value).deptos

      if (!deptos_txt) {
        return toaster.error(`No Hay Datos de Pagos de deptos`, { position: 'top-right' }), setLoaderEmit(false);
      }

      Object.entries(deptos_txt).forEach(([key, value]) =>
        SendPagoStorage(value, key, deptos)
      );

      setLoaderEmit(false)
    } catch (error) {
      setLoaderEmit(false)
      toaster.error(`Error Al Cargar Archivo de Pagos - ${error}`, { position: 'top-right' })
      setTimeout(() => {
        deleteLocaleStorage()
        return location.reload()
      }, 700)
    }
  }

  const SendPagoStorage = (value, indexdepto, deptos) => {
    try {
      if (!deuda_depto.length) {
        JSON.parse(localStorage?.getItem('deuda_depto')).forEach(d => deuda_depto.push(Number(d)))
      }
      if (!saldo_favor.length) {
        JSON.parse(localStorage?.getItem('saldo_favor')).forEach(s => saldo_favor.push(Number(s)))
      }

      let deuda_depto_value = 0
      let saldo_favor_value = 0

      let DeptosArray = Object.keys(deptos)
      let index = DeptosArray.findIndex(key => key === indexdepto)

      if (index === -1) {
        return toaster.error(`Error en Index de Depto`, { position: 'top-right' });
      }

      let valor = 0
      valor = Number((deuda_depto[index] - value).toFixed(2))

      if (Math.sign(valor) === 0 || Math.sign(valor) === 1) {
        deuda_depto_value = valor, saldo_favor_value = saldo_favor[index]
        return SendPagoResult({ deuda_depto_value, saldo_favor_value, index: indexdepto, deptos, pago: value })

      } else if (Math.sign(valor) === -0 || Math.sign(valor) === -1) {
        deuda_depto_value = 0, saldo_favor_value = (saldo_favor[index] + (valor * -1))
        return SendPagoResult({ deuda_depto_value, saldo_favor_value, index: indexdepto, deptos, pago: value })
      }
      return toaster.error(`Error Al Cargar Pagos de ${indexdepto.replace('_', ' ')}`, { position: 'top-right' });
    } catch (error) {
      toaster.error(`Error Al Cargar Pagos - ${error}`, { position: 'top-right' });
      setTimeout(() => {
        deleteLocaleStorage()
        return location.reload()
      }, 700)
    }

  }

  return {
    datos_session,
    doLocaleStorage,
    setLocaleStorage,
    deleteLocaleStorage,
    uploadTxt,
    refTxt,
    downloadTxt,
    SendPagoStorage,
    Loader,
    setLoader,
    setLoaderEmit,
    datos_act_session,
    SendPagoStorage,
    uploadTxtPagos,
  }
}









// const SendPagoStorage = (value, depto, index, deptos) => {
//   try {

//     if (!deuda_depto.length) {
//       JSON.parse(localStorage?.getItem('deuda_depto')).forEach(d => deuda_depto.push(Number(d)))
//     }
//     if (!saldo_favor.length) {
//       JSON.parse(localStorage?.getItem('saldo_favor')).forEach(s => saldo_favor.push(Number(s)))
//     }

//     let deuda_depto_value = 0
//     let saldo_favor_value = 0

//     let valor = 0
//     valor = Number((deuda_depto[index] - value).toFixed(2))

//     if (Math.sign(valor) === 0 || Math.sign(valor) === 1) {
//       deuda_depto_value = valor, saldo_favor_value = saldo_favor[index]
//       return SendPagoResult({ deuda_depto_value, saldo_favor_value, index: depto, deptos })

//     } else if (Math.sign(valor) === -0 || Math.sign(valor) === -1) {
//       deuda_depto_value = 0, saldo_favor_value = (saldo_favor[index] + (valor * -1))
//       return SendPagoResult({ deuda_depto_value, saldo_favor_value, index: depto, deptos })
//     }
//     return toaster.error(`Error Al Cargar Pagos de ${depto.replace('_', ' ')}`, { position: 'top-right' });
//   } catch (error) {
//     toaster.error(`Error Al Cargar Pagos - ${error}`, { position: 'top-right' });
//     setTimeout(() => {
//       deleteLocaleStorage()
//       return location.reload()
//     }, 700)
//   }
// }