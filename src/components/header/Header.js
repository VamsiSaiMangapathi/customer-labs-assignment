const HeaderPage = (props) => {
  const { title, onClose, modalClose } = props;
  return (
    <div className="w-auto px-6 py-4 bg-[#3fc9d4] flex justify-between">
      <span className="w-fit flex gap-2.5 items-center">
        <span className="font-bold text-white text-xl">{"<"}</span>
        <span className="text-white text-lg font-bold">{title}</span>
      </span>
      {modalClose && (
        <div
          onClick={onClose}
          className="text-white text-lg font-semibold cursor-pointer"
        >
          ×
        </div>
      )}
    </div>
  );
};

export default HeaderPage;
