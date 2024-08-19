export default async function Profile() {
  return (
    <div className="text-white">
      {process.env["SPOTIFY_CLIENT_ID"]}
      {process.env["SPOTIFY_CLIENT_SECRET"]}
      {process.env["SPOTIFY_REDIRECT_URL"]}
      <div>
        <div className="">
          <div className="w-48 h-48 relative p-8 flex">
            <div className="min-w-1/2 border-2 border-red-600 absolute">
              Left
            </div>
            <div className="min-w-1/2 border-2 border-red-600 absolute">
              Right
            </div>
            <div className="absolute top-2 right-2 rounded-full text-md px-2 py-1 font-semibold">
              123
            </div>
            <img
              src="https://yt3.ggpht.com/ytc/AIdro_muNFL-sKuOPm72UvG-ofixqx70KVyRS4365-fTtxH_cg=s88-c-k-c0x00ffffff-no-rj"
              alt="Song Cover"
              className="w-full h-full object-cover rounded-lg hover:scale-105 "
            />
            <div className="mt-4 text-center">
              <p className="text-sm font-semibold">Song Name</p>
              <p className="text-xs">Artist</p>
            </div>
          </div>
        </div>

        <div className="w-48 h-48 bg-blue-100 relative flex">
          <div className="w-1/2 border-2 border-red-600">Left</div>
          <div className="w-1/2 border-2 border-red-600">Right</div>
        </div>
      </div>
    </div>
  );
}
