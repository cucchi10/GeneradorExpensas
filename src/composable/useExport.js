
import XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';

import { createToaster } from "@meforma/vue-toaster";
const toaster = createToaster();


export default function useStorage(showDeptoSelect, emit) {

  const setLoaderEmit = (value) => {
    emit('setLoaderEmit', value)
  }

  const doExportPDFMasive = async (month, deptos) => {
    try {
      setLoaderEmit(true)
      if (month === 'Seleccione un Mes') {
        return toaster.error('Selecciona un Mes', { position: 'top' }), setLoaderEmit(false);
      }
      let Year;
      if (month === 'Enero' && new Date().getMonth() === 11) {
        Year = new Date().getFullYear() + 1
      } else {
        Year = new Date().getFullYear()
      }

      let element = document.getElementById('ExpensasPDF');
      element.classList.add('class-pdf');

      let title = document.getElementById('TittlePdf');
      title.classList.remove('class-title-pdf');

      for (let [index, depto] of Object.entries(deptos)) {
        showDeptoSelect(depto, index)
        let opt = {
          margin: 0.6,
          filename: `Expensas_${month}_${Year}_Dpto_${index}.pdf`,
          image: { type: 'jpg', quality: 0.9 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait', compressPDF: false },
          pagebreak: { mode: ['avoid-all'] }
        };
        await html2pdf().from(element).set(opt).save()
      }

      showDeptoSelect(null)

      let opt = {
        margin: 0.6,
        filename: `Expensas_${month}_${Year}_General.pdf`,
        image: { type: 'jpg', quality: 0.9 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait', compressPDF: false },
        pagebreak: { mode: ['avoid-all'] }
      };

      html2pdf().from(element).set(opt).save().finally(() => { element.classList.remove('class-pdf'), title.classList.add('class-title-pdf') }, setLoaderEmit(false))

    } catch (error) {
      toaster.error(`Error Al Generar PDF - ${error}`, { position: 'top-right' })
      setLoaderEmit(false)
    }
  }

  const doExportPDF = (item, month) => {
    try {
      setLoaderEmit(true)
      let Year
      if (month === 'Enero' && new Date().getMonth() === 11) {
        Year = new Date().getFullYear() + 1
      } else {
        Year = new Date().getFullYear()
      }
      if (!Object.values(item).length) {
        return toaster.error('Selecciona un Departamento en la Tabla', { position: 'bottom' }), setLoaderEmit(false);
      }
      if (month === 'Seleccione un Mes') {
        return toaster.error('Selecciona un Mes', { position: 'top' }), setLoaderEmit(false);
      }
      let depto = item.index
      let mes = month


      let element = document.getElementById('ExpensasPDF');
      element.classList.add('class-pdf');

      let opt = {
        margin: 0.6,
        filename: `Expensas_${mes}_${Year}_Dpto_${depto}.pdf`,
        image: { type: 'jpg', quality: 0.9 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait', compressPDF: false },
        pagebreak: { mode: ['avoid-all'] }
      };

      let title = document.getElementById('TittlePdf');
      title.classList.remove('class-title-pdf');

      html2pdf().from(element).set(opt).save().finally(() => { element.classList.remove('class-pdf'), title.classList.add('class-title-pdf') }, setLoaderEmit(false));

    } catch (error) {
      setLoaderEmit(false)
      toaster.error(`Error Al Generar PDF - ${error}`, { position: 'top-right' })
    }
  }

  const create_gap_rows = (ws, nrows) => {
    var ref = XLSX.utils.decode_range(ws["!ref"]);
    ref.e.r += nrows;
    return XLSX.utils.encode_range(ref);
  }

  const doExportXSLX = (month) => {
    try {
      setLoaderEmit(true)
      showDeptoSelect(null)
      let Year
      if (month === 'Enero' && new Date().getMonth() === 11) {
        Year = new Date().getFullYear() + 1
      } else {
        Year = new Date().getFullYear()
      }
      if (month === 'Seleccione un Mes') {
        return toaster.error('Selecciona un Mes', { position: 'top' }), setLoaderEmit(false);
      }
      const gastos = document.getElementById('PlanillaGastos');
      const deptos = document.getElementById('PlanillaDeptos');
      const detalles = document.getElementById('PlanillaDetalles');

      const headers = ["Gastos", "Deptos", "Detalles"];

      const worksheet = XLSX.utils.aoa_to_sheet([[headers[0]]]);
      XLSX.utils.sheet_add_dom(worksheet, gastos, { origin: -1 });
      worksheet["!ref"] = create_gap_rows(worksheet, 1)
      XLSX.utils.sheet_add_aoa(worksheet, [[headers[1]]], { origin: -1 });
      XLSX.utils.sheet_add_dom(worksheet, deptos, { origin: -1 });
      worksheet["!ref"] = create_gap_rows(worksheet, 2)
      XLSX.utils.sheet_add_aoa(worksheet, [[headers[2]]], { origin: -1 });
      XLSX.utils.sheet_add_dom(worksheet, detalles, { origin: -1 });

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `Expensas ${month} ${Year}`);

      XLSX.writeFile(workbook, `Expensas_${month}_${Year}.xlsx`);
      setLoaderEmit(false)
    } catch (error) {
      setLoaderEmit(false)
      console.log(error)
      toaster.error(`Error Al Generar PDF - ${error}`, { position: 'top-right' })
    }
  }


  return {
    doExportPDF,
    doExportPDFMasive,
    doExportXSLX,
  }
}