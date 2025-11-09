// // app/auth/callback/page.tsx

import { Suspense } from "react";
import AuthCallbackClient from "./AuthCallbackClient";


export default function Page() {
  return (
    // <Suspense fallback={<div>Loading...</div>}>
    <Suspense>
      <AuthCallbackClient />
    </Suspense>
  );
}

// "use client";
// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function AuthCallback() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // New logic inside useEffect
//   useEffect(() => {
//     const token = searchParams.get("token");
//     console.log("Extracted token from URL:", token);

//     if (token) {
//       fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/set-cookie`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({ token }),
//       })
//         .then(async (res) => {
//           console.log("Set-Cookie Response:", res.status, res.statusText);
//           const text = await res.text();
//           console.log("Backend response text:", text);
//           if (res.ok) {
//             router.push("/dashboard");
//           } else {
//             router.push("/landing");
//           }
//         })
//         .catch((err) => {
//           console.error("Fetch error:", err);
//           router.push("/landing");
//         });
//     } else {
//       console.warn("No token found in URL");
//       router.push("/landing");
//     }
//   }, [searchParams, router]);

//   return (
//     <div
//       className="
//         min-h-screen          
//         flex                   
//         items-center           
//         justify-center         
//         bg-background          
//         text-foreground         
//         p-4                   
//       "
//     >
//       <div
//         className="
//           flex flex-col         
//           items-center          
//           p-8                   
//           bg-card               
//           rounded-lg            
//           shadow-lg            
//           max-w-sm          
//           w-full               
//         "
//       >
//         {/* Modern Spinner */}
//         <div
//           className="
//               w-16 h-16
//               border-4
//               border-t-transparent
//               rounded-full
//               animate-spin-slow
//               bg-gradient-to-tr
//               from-pink-500 via-purple-500 to-indigo-500
//               border-r-pink-500 border-b-purple-500 border-l-indigo-500
//               mb-6
//             "
//           role="status"
//         >
//           <span className="sr-only">Loading...</span>
//         </div>

//         {/* Modern Loading Message */}
//         <h2
//           className="
//             text-2xl              
//             font-semibold        
//             text-muted-foreground 
//             mb-2                
//           "
//         >
//           Logging you in...
//         </h2>
//         <p className="text-sm text-muted-foreground">
//           Please wait while we set up your session.
//         </p>
//       </div>
//     </div>
//   );
// }
