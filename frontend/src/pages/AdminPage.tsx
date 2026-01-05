// ============================================
// ADMIN PAGE - Administratorski panel
// ============================================
// Simplified admin panel for managing questions
// ============================================

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2 } from "lucide-react"
import * as quizApi from "@/api/quiz.api"
import * as adminApi from "@/api/admin.api"
import type { Question } from "@/types"

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({})
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const data = await quizApi.getAllQuestions()
      setQuestions(data.questions)
    } catch (error) {
      console.error("Error loading questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setCurrentQuestion({
      difficulty: 1,
      category: "Opšta kultura",
      correct_answer: "A",
    })
    setIsEditing(false)
    setDialogOpen(true)
  }

  const handleEdit = (question: Question) => {
    setCurrentQuestion(question)
    setIsEditing(true)
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Da li ste sigurni da želite obrisati ovo pitanje?")) return

    try {
      await adminApi.deleteQuestion(id)
      await loadQuestions()
    } catch (error) {
      console.error("Error deleting question:", error)
      alert("Greška pri brisanju pitanja")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && currentQuestion.id) {
        await adminApi.updateQuestion(currentQuestion.id, currentQuestion)
      } else {
        await adminApi.createQuestion(currentQuestion as any)
      }
      await loadQuestions()
      setDialogOpen(false)
    } catch (error: any) {
      console.error("Error saving question:", error)
      alert(error.response?.data?.error || "Greška pri čuvanju pitanja")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Učitavanje...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Dodaj pitanje
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pitanja ({questions.length})</CardTitle>
            <CardDescription>Upravljanje pitanjima za kviz</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pitanje</TableHead>
                  <TableHead>Težina</TableHead>
                  <TableHead>Kategorija</TableHead>
                  <TableHead>Tačan odgovor</TableHead>
                  <TableHead className="text-right">Akcije</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>{question.id}</TableCell>
                    <TableCell className="max-w-md truncate">{question.question_text}</TableCell>
                    <TableCell>{question.difficulty}</TableCell>
                    <TableCell>{question.category}</TableCell>
                    <TableCell className="font-bold">{question.correct_answer}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(question)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(question.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog za dodavanje/izmjenu pitanja */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Izmeni pitanje" : "Dodaj novo pitanje"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="question_text">Tekst pitanja</Label>
                <Input
                  id="question_text"
                  value={currentQuestion.question_text || ""}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="option_a">Odgovor A</Label>
                  <Input
                    id="option_a"
                    value={currentQuestion.option_a || ""}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, option_a: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="option_b">Odgovor B</Label>
                  <Input
                    id="option_b"
                    value={currentQuestion.option_b || ""}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, option_b: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="option_c">Odgovor C</Label>
                  <Input
                    id="option_c"
                    value={currentQuestion.option_c || ""}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, option_c: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="option_d">Odgovor D</Label>
                  <Input
                    id="option_d"
                    value={currentQuestion.option_d || ""}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, option_d: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Tačan odgovor</Label>
                  <Select
                    value={currentQuestion.correct_answer}
                    onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correct_answer: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Težina (1-15)</Label>
                  <Input
                    id="difficulty"
                    type="number"
                    min="1"
                    max="15"
                    value={currentQuestion.difficulty || 1}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, difficulty: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Kategorija</Label>
                  <Input
                    id="category"
                    value={currentQuestion.category || ""}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, category: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Otkaži
                </Button>
                <Button type="submit">{isEditing ? "Sačuvaj izmjene" : "Dodaj pitanje"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
