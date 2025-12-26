import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Upload, X, Save } from "lucide-react";
import type { Profile } from "@shared/schema";

export default function ProfileManagement() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bio1, setBio1] = useState("");
  const [bio2, setBio2] = useState("");
  const [bio3, setBio3] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  useEffect(() => {
    if (profile) {
      setProfileImage(profile.profileImageUrl);
      setBio1(profile.bio1);
      setBio2(profile.bio2);
      setBio3(profile.bio3);
      setSkills(profile.skills || []);
      setContactEmail(profile.contactEmail);
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", "/api/profile", {
        profileImageUrl: profileImage,
        bio1,
        bio2,
        bio3,
        skills,
        contactEmail,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully",
      });
    },
    onError: (error: any) => {
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
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      const newImageUrl = data.imageUrl;
      setProfileImage(newImageUrl);

      await apiRequest("PATCH", "/api/profile/image", {
        profileImageUrl: newImageUrl,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been saved and is now visible on your site",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Profile Settings
        </h2>
        <p className="text-muted-foreground mt-1">
          Update your profile picture, bio, and skills
        </p>
      </div>

      <Card className="p-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <Label>Profile Picture</Label>
            {profileImage ? (
              <div className="flex items-start gap-4">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-border"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("profile-image-upload")?.click()}
                  disabled={uploading}
                  data-testid="button-change-profile-image"
                >
                  {uploading ? "Uploading..." : "Change Picture"}
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => document.getElementById("profile-image-upload")?.click()}
                  data-testid="button-upload-profile-image"
                >
                  {uploading ? "Uploading..." : "Upload Picture"}
                </Button>
              </div>
            )}
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio1">Bio Paragraph 1</Label>
            <Textarea
              id="bio1"
              value={bio1}
              onChange={(e) => setBio1(e.target.value)}
              rows={3}
              data-testid="input-bio-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio2">Bio Paragraph 2</Label>
            <Textarea
              id="bio2"
              value={bio2}
              onChange={(e) => setBio2(e.target.value)}
              rows={3}
              data-testid="input-bio-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio3">Bio Paragraph 3</Label>
            <Textarea
              id="bio3"
              value={bio3}
              onChange={(e) => setBio3(e.target.value)}
              rows={3}
              data-testid="input-bio-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              data-testid="input-contact-email"
            />
            <p className="text-sm text-muted-foreground">
              Contact form submissions will be sent to this email
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <div className="flex gap-2">
              <Input
                id="skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                placeholder="Add a skill"
                data-testid="input-skill"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSkill}
                data-testid="button-add-skill"
              >
                Add
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2"
                      data-testid={`button-remove-skill-${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              data-testid="button-save-profile"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveMutation.isPending ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
