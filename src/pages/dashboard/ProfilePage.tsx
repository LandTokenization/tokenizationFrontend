import { useState } from "react";
import { Edit2, X, Save } from "lucide-react";

const DZONGKHAGS = [
  "Bumthang",
  "Chhukha",
  "Chirang",
  "Dagana",
  "Gasa",
  "Gelephu",
  "Ha",
  "Lhuentse",
  "Mongar",
  "Paro",
  "Punakha",
  "Samdrup Jongkhar",
  "Sarpang",
  "Thimphu",
  "Thimphu Thromde",
  "Trashigang",
  "Trashiyangtse",
  "Wangdue Phodrang",
  "Tsirang",
  "Trongsa",
];

const OCCUPATIONS = [
  "Civil Service",
  "Corporate",
  "Business",
  "Armed Force (RBG, RBA, RBP)",
  "Farmer",
  "Monk",
  "Student",
  "Illiterate",
  "Others",
];

interface ProfileData {
  firstName: string;
  lastName: string;
  cid: string;
  occupation: string;
  permanentDzongkhag: string;
  permanentGewog: string;
  permanentVillage: string;
  presentDzongkhag: string;
  presentGewog: string;
  presentVillage: string;
  email: string;
  phone: string;
  emergencyContact: string;
  bankName: string;
  accountNumber: string;
}

const initialData: ProfileData = {
  firstName: "Yeshi",
  lastName: "Gyeltshen",
  cid: "12000000072",
  occupation: "Civil Service",
  permanentDzongkhag: "Zhemgang",
  permanentGewog: "Nangkor",
  permanentVillage: "Buli",
  presentDzongkhag: "Thimphu",
  presentGewog: "Thimphu Thromde",
  presentVillage: "Changangkha",
  email: "ygyel777@gmail.com",
  phone: "77888875",
  emergencyContact: "17776293",
  bankName: "DK Bank",
  accountNumber: "1101****1",
};

// Reusable Form Field Component
function FormField({
  label,
  value,
  isEditing,
  onChange,
  type = "text",
  options,
}: {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "select";
  options?: string[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {isEditing ? (
        type === "select" && options ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-background/40 border border-primary/40 rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-background/40 border border-primary/40 rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
        )
      ) : (
        <p className="text-foreground font-medium px-3 py-2.5 bg-background/20 rounded-md">
          {value}
        </p>
      )}
    </div>
  );
}

// Section Component
function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-background/20 backdrop-blur border border-border/40 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-primary/20">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialData);

  const handleFieldChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setProfileData(initialData);
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Save to backend
    console.log("Saved profile data:", profileData);
  };

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage your personal information
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
            isEditing
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40"
              : "bg-primary/20 text-primary hover:bg-primary/30 border border-primary/40"
          }`}
        >
          {isEditing ? (
            <>
              <X size={18} /> Cancel
            </>
          ) : (
            <>
              <Edit2 size={18} /> Edit Info
            </>
          )}
        </button>
      </div>

      {/* PERSONAL INFORMATION */}
      <ProfileSection title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="First Name"
            value={profileData.firstName}
            isEditing={isEditing}
            onChange={(value) => handleFieldChange("firstName", value)}
          />
          <FormField
            label="Last Name"
            value={profileData.lastName}
            isEditing={isEditing}
            onChange={(value) => handleFieldChange("lastName", value)}
          />
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              CID (View Only)
            </label>
            <p className="text-foreground font-medium px-3 py-2.5 bg-background/20 rounded-md">
              {profileData.cid}
            </p>
          </div>
          <div className="md:col-span-3">
            <FormField
              label="Occupation"
              value={profileData.occupation}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange("occupation", value)}
              type="select"
              options={OCCUPATIONS}
            />
          </div>
        </div>
      </ProfileSection>

      {/* PERMANENT ADDRESS */}
      <ProfileSection title="Permanent Address">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Dzongkhag"
            value={profileData.permanentDzongkhag}
            isEditing={isEditing}
            onChange={(value) => handleFieldChange("permanentDzongkhag", value)}
            type="select"
            options={DZONGKHAGS}
          />
          <FormField
            label="Gewog/Throm"
            value={profileData.permanentGewog}
            isEditing={isEditing}
            onChange={(value) => handleFieldChange("permanentGewog", value)}
          />
          <FormField
            label="Village"
            value={profileData.permanentVillage}
            isEditing={isEditing}
            onChange={(value) => handleFieldChange("permanentVillage", value)}
          />
        </div>
      </ProfileSection>

      {/* PRESENT ADDRESS */}
      <ProfileSection title="Present Address">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Dzongkhag"
            value={profileData.presentDzongkhag}
            isEditing={isEditing}
            onChange={(value) => handleFieldChange("presentDzongkhag", value)}
            type="select"
            options={DZONGKHAGS}
          />
          <FormField
            label="Gewog/Throm"
            value={profileData.presentGewog}
            isEditing={isEditing}
            onChange={(value) => handleFieldChange("presentGewog", value)}
          />
          <FormField
            label="Village"
            value={profileData.presentVillage}
            isEditing={isEditing}
            onChange={(value) => handleFieldChange("presentVillage", value)}
          />
        </div>
      </ProfileSection>

      {/* CONTACT DETAILS */}
      <ProfileSection title="Contact Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Email"
            value={profileData.email}
            isEditing={isEditing}
            onChange={(value) => handleFieldChange("email", value)}
            type="email"
          />
          <FormField
            label="Phone Number"
            value={profileData.phone}
            isEditing={isEditing}
            onChange={(value) => handleFieldChange("phone", value)}
            type="tel"
          />
          <FormField
            label="Emergency Contact"
            value={profileData.emergencyContact}
            isEditing={isEditing}
            onChange={(value) => handleFieldChange("emergencyContact", value)}
          />
        </div>
      </ProfileSection>

      {/* BANK DETAILS */}
      <ProfileSection title="Bank Details">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary/30 border-b-2 border-primary/50">
                <th className="px-4 py-3 text-left text-foreground font-semibold w-16">
                  Sl No
                </th>
                <th className="px-4 py-3 text-left text-foreground font-semibold">
                  Bank Name
                </th>
                <th className="px-4 py-3 text-left text-foreground font-semibold">
                  Account Number
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-background/40 border-b border-border/20 hover:bg-primary/10 transition">
                <td className="px-4 py-3 text-foreground font-medium">1</td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.bankName}
                      onChange={(e) => handleFieldChange("bankName", e.target.value)}
                      className="w-full px-3 py-2 bg-background/40 border border-primary/40 rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  ) : (
                    <span className="text-foreground">{profileData.bankName}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.accountNumber}
                      onChange={(e) => handleFieldChange("accountNumber", e.target.value)}
                      className="w-full px-3 py-2 bg-background/40 border border-primary/40 rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  ) : (
                    <span className="text-foreground font-mono">{profileData.accountNumber}</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ProfileSection>

      {/* ACTION BUTTONS */}
      {isEditing && (
        <div className="flex gap-3 justify-end pt-6 border-t border-border/20">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 bg-background/40 border border-border/40 text-foreground text-sm font-semibold rounded-lg hover:bg-background/60 transition-all"
          >
            Discard Changes
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Save size={16} /> Save Profile
          </button>
        </div>
      )}
    </div>
  );
}
