import ProfileForm from "@/components/profile/profile-form";
import ProtectedRoute from "@/components/auth/protected-route";

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Edit profile</p>
              <h1 className="mt-4 text-3xl font-semibold">Update your details</h1>
              <p className="mt-2 text-slate-400">Keep your information current for mentor matching.</p>
            </div>
            <ProfileForm />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
