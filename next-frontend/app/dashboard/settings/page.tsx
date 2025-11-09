'use client'

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Settings() {
  const [username, setUsername] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [remainingDays, setRemainingDays] = useState<number | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_USER_DETAILS}`, {
          credentials: "include",
        })

        if (!res.ok) throw new Error("Failed to fetch user details")

        const data = await res.json()
        setUsername(data.username || "")
        setNewUsername("") 
        // setNewUsername(data.username || "")

        // Parse username_updated_at
        if (data.username_updated_at?.Valid && data.username_updated_at?.Time) {
          const lastUpdated = new Date(data.username_updated_at.Time)
          const now = new Date()
          const diffMs = now.getTime() - lastUpdated.getTime()
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
          const cooldown = 30

          if (diffDays < cooldown) {
            setRemainingDays(cooldown - diffDays)
          } else {
            setRemainingDays(null)
          }
        }

      } catch (err) {
        console.error("Failed to fetch user details:", err)
        toast.error("Could not load user")
      }
    }

    fetchUser()
  }, [])

  const handleUpdate = async () => {
    if (newUsername.trim() === "" || newUsername === username) return
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_UPDATE_USERNAME}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ new_username: newUsername }),
      })

      const result = await res.json()

      if (!res.ok) {
        if (result?.remaining_days) {
          setRemainingDays(result.remaining_days)
          toast.error(`Try again in ${result.remaining_days} days`)
        } else {
          toast.error(result?.error || "Update failed")
        }
        return
      }

      toast.success("Username updated")
      setUsername(newUsername)
      setRemainingDays(30) // restart cooldown

    } catch (err) {
      console.error("Update failed:", err)
      toast.error("Update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="username" className="mb-3 ml-1">Username</Label>
              <Input
                ref={inputRef}
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new username"
              />
            </div>

            {remainingDays !== null ? (
              <p className="text-sm _text-red-500 ml-1">
                ⚠️ You can change your username again in <strong className=" text-red-500">{remainingDays}</strong> day{remainingDays !== 1 && 's'}.
              </p>
            ) : (
              <p className="text-xs _text-muted-foreground ml-1 text-red-500">
                You can change your username once every 30 days.
              </p>
            )}

            <Button onClick={handleUpdate} disabled={loading || newUsername.trim() === "" || remainingDays !== null}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

