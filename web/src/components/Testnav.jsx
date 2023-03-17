import React from 'react'
// scroll direction hook
function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = React.useState(null);
  
    React.useEffect(() => {
      let lastScrollY = window.pageYOffset;
  
      const updateScrollDirection = () => {
        const scrollY = window.pageYOffset;
        const direction = scrollY > lastScrollY ? "down" : "up";
        if (direction !== scrollDirection && (scrollY - lastScrollY > 5 || scrollY - lastScrollY < -5)) {
          setScrollDirection(direction);
        }
        lastScrollY = scrollY > 0 ? scrollY : 0;
      };
      window.addEventListener("scroll", updateScrollDirection); // add event listener
      return () => {
        window.removeEventListener("scroll", updateScrollDirection); // clean up
      }
    }, [scrollDirection]);
  
    return scrollDirection;
  };

    
  
function Testnav() {
    const scrollDirection = useScrollDirection();
  return (
    <div className={`sticky ${ scrollDirection === "down" ? "-top-24" : "top-0"} h-24 bg-blue-200 transition-all duration-500`}>
      <div className="p-5 font-bold">Disappearing Header</div>
    </div>
  )
}

export default Testnav
