import { LinkedIn, LinkedInConnect, Verified } from "@/icons";
import Image from "next/image";

const ProfileCard = () => {
  function handleConnect() {
    window.open("https://www.linkedin.com/in/husnu/", "_blank");
  }
  return (
    <div className="bg-black shadow-md mx-auto px-4 py-4 rounded-lg w-full">
      <div className="flex flex-col px-2">
        <div className="relative mb-4 w-24 h-24">
          <Image
            src="/me.webp" // Buraya resim dosyasının yolunu koy.
            alt="Profile Picture"
            layout="fill"
            className="rounded-full object-cover"
          />
        </div>

        {/* Ad ve Unvan */}
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-[#dfff1f] text-xl">
              Hüsnü Lübnan
            </h2>
            <Verified className="w-4 h-4 text-white" />
          </div>
          <LinkedIn className="w-4 h-4" fill="#c37d16" />
        </div>
        <p className="mb-2 text-gray-200">Frontend Developer</p>
        <div className="flex items-center gap-2 my-2 text-gray-500">
          <Image src="/ege.jpeg" alt="Profile Picture" width={20} height={20} />
          <p className="text-gray-200">Ege Üniversitesi</p>
        </div>

        {/* Konum ve İletişim */}
        <p className="mt-2 text-gray-400 text-sm">İzmir, Türkiye</p>

        {/* Takipçi ve Bağlantılar */}
        <div className="flex justify-between space-x-4 mt-4 w-full">
          <p className="text-gray-200 text-sm">500+ bağlantı</p>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleConnect}
            className="flex justify-center items-center gap-2 bg-[#dfff1f] hover:bg-[#dfff1f88] px-4 py-2 rounded-full w-full text-sm text-white transition-all duration-300"
          >
            <LinkedInConnect className="w-4 h-4" />
            Bağlantı Kur
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
