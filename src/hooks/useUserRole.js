import { useState, useEffect } from "react";
import { useDocument } from "../hooks/useDocument";

export function useUserRole(user) {
  const { error, document } = useDocument("users", user.uid);
  const [userRole, setUserRole] = useState("");
  // const [ isCancelled, setIsCancelled ] = useState(false)

  // const loggedinUserRole = document.userRole
  useEffect(() => {
    if (document) {
      setUserRole(document.userRole);
      // setIsCancelled(true)
    }
  }, [document]);

  return userRole;
}
