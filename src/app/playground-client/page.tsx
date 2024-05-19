"use client"

import { Button } from "@/components/ui/button"
import { api } from "@/trpc/react"

export default function Page() {
    const addEmbeddingsMutation = api.addEmbeddings.useMutation({
        onSuccess: () => {
            alert("Embeddings added")
        }
    })

    return <Button onClick={() => addEmbeddingsMutation.mutate()} disabled={addEmbeddingsMutation.isPending}>Add Embeddings</Button>
}

