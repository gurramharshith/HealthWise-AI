
import * as React from "react"

const MOBILE_BREAKPOINT = 1024 // lg

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Check on mount
    checkDevice();
    
    // Add resize listener
    window.addEventListener("resize", checkDevice);
    
    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", checkDevice);
  }, [])

  // Return false on the server, and the actual value on the client
  return typeof window === 'undefined' ? false : isMobile;
}
