
import {  ref } from "@vue/reactivity";

export default function useStorage(){
  const datos_session = ref(false)

  return{
    datos_session
  }
}