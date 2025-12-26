import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Upload, X, Plus, GripVertical } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

export default function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    imageUrls: [] as string[],
    deviceType: "monitor",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl,
        imageUrls: project.imageUrls || [],
        deviceType: project.deviceType,
        tags: project.tags || [],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        imageUrls: [],
        deviceType: "monitor",
        tags: [],
      });
    }
  }, [project]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (project) {
        await apiRequest("PATCH", `/api/projects/${project.id}`, data);
      } else {
        await apiRequest("POST", "/api/projects", { ...data, orderIndex: "0" });
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: project ? "Project updated" : "Project created",
        description: "Your changes have been saved",
      });
      onOpenChange(false);
    },
    onError(err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setFormData({ ...formData, imageUrl: data.imageUrl });
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAdditional(true);
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setFormData({ 
        ...formData, 
        imageUrls: [...formData.imageUrls, data.imageUrl] 
      });
      toast({
        title: "Image uploaded",
        description: "Additional image has been added",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingAdditional(false);
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast({
        title: "Image required",
        description: "Please upload a project image",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Add New Project"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              data-testid="input-project-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              required
              data-testid="input-project-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deviceType">Display Device</Label>
            <Select
              value={formData.deviceType}
              onValueChange={(value) =>
                setFormData({ ...formData, deviceType: value })
              }
            >
              <SelectTrigger data-testid="select-device-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monitor">Monitor</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Main Project Image</Label>
            {formData.imageUrl ? (
              <div className="relative">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => setFormData({ ...formData, imageUrl: "" })}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    data-testid="button-upload-image"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </Button>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Additional Images (for multi-page apps/websites)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Add more images for projects with multiple pages. Users can swipe through them in the device display.
            </p>
            
            {formData.imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Additional ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditionalImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid={`button-remove-additional-image-${index}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-1 left-1 w-5 h-5 bg-background/80 rounded text-xs flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <label htmlFor="additional-image-upload" className="cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingAdditional}
                  data-testid="button-upload-additional-image"
                  onClick={() => document.getElementById("additional-image-upload")?.click()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {uploadingAdditional ? "Uploading..." : "Add Another Image"}
                </Button>
              </label>
              <input
                id="additional-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAdditionalImageUpload}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag"
                data-testid="input-tag"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                data-testid="button-add-tag"
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2"
                      data-testid={`button-remove-tag-${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending} data-testid="button-save-project">
              {saveMutation.isPending ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
