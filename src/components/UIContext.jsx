import { createContext, useContext, useState, useCallback } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [video, setVideo] = useState(null)
  const [image, setImage] = useState(null)
  const [ceoOpen, setCeoOpen] = useState(false)
  const [sideOpen, setSideOpen] = useState(false)
  const [accordionOpen, setAccordionOpen] = useState(null)

  const openVideo = useCallback((url) => setVideo(url), [])
  const openImage = useCallback((src) => setImage(src), [])
  const openCeo = useCallback(() => {
    setVideo(null)
    setImage(null)
    setCeoOpen(true)
  }, [])
  const closeAll = useCallback(() => {
    setVideo(null)
    setImage(null)
    setCeoOpen(false)
  }, [])

  return (
    <UIContext.Provider
      value={{
        video,
        image,
        ceoOpen,
        sideOpen,
        setSideOpen,
        accordionOpen,
        setAccordionOpen,
        openVideo,
        openImage,
        openCeo,
        closeAll,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  return useContext(UIContext)
}
