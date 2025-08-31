import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc"
import axios from 'axios'
import { Sun, Moon } from 'lucide-react' // Optional: icon library

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  )

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full border border-border shadow-sm transition-colors bg-muted hover:bg-accent"
    >
      {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  )
}

function Header() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [openDialog, setOpenDialog] = useState(false)

  const login = useGoogleLogin({
    onSuccess: (res) => GetUserProfile(res),
    onError: (error) => console.log(error),
  })

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo.access_token}`,
          Accept: 'application/json',
        },
      })
      .then((resp) => {
        localStorage.setItem('user', JSON.stringify(resp.data))
        setOpenDialog(false)
        window.location.reload()
      })
      .catch((error) => {
        console.error("Error fetching user profile: ", error)
      })
  }

  return (
    <header className="w-full flex items-center justify-between shadow-sm p-4 md:px-40 border-b bg-background text-foreground">
      {/* Logo */}
      <a href="/" className="flex items-center gap-3">
        <img src="/logo.png" alt="JourniQ Logo" className="h-8 w-8 md:h-10 md:w-10" />
        <h1 className="text-xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
          JourniQ
        </h1>
      </a>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <DarkModeToggle />

        {user ? (
          <>
            <a href="/create-trip">
              <Button variant="outline" className="rounded-full">
                + Create Trip
              </Button>
            </a>
            <a href="/my-trips">
              <Button variant="outline" className="rounded-full">
                My Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  alt={`${user?.name}'s avatar`}
                  className="h-9 w-9 rounded-full border"
                />
              </PopoverTrigger>
              <PopoverContent className="text-sm font-medium cursor-pointer">
                <h2
                  onClick={() => {
                    googleLogout()
                    localStorage.clear()
                    window.location.reload()
                  }}
                  className="hover:text-destructive"
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
      </div>

      {/* Google Auth Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="space-y-4 text-center">
              <img
                src="/logo.png"
                alt="JourniQ Logo"
                width="80"
                className="mx-auto"
              />
              <h2 className="font-bold text-lg">Sign in to JourniQ</h2>
              <p className="text-sm text-muted-foreground">
                Plan your journeys, save your trips, and explore the world!
              </p>
              <Button
                onClick={login}
                className="w-full mt-6 flex gap-3 items-center justify-center"
              >
                <FcGoogle className="h-6 w-6" />
                Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  )
}

export default Header
