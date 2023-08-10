import Select from "@/components/Select";
import data from "./data.json";
import { useEffect, useMemo, useState } from "react";
import "./index.less";
import {
  MinusCircleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import Swal from "sweetalert2";

export default function HomePage() {
  const [type, setType] = useState(Object.keys(data)[0]);
  const [job, setJob] = useState<string>();
  const [needs, setNeeds] = useState<(null | string)[]>(
    new Array(9).fill(null)
  );
  const [isLock, setIsLock] = useState(false);
  const [myNodes, setMyNodes] = useState<string[][]>([]);

  const jobOptions = useMemo(() => {
    const t = (data as any)[type];
    if (!t.length) {
      return Object.keys(t).map((key) => ({ name: key }));
    }
    return [];
  }, [type]);

  useEffect(() => {
    if (jobOptions.length) {
      setJob(jobOptions[0].name);
    } else {
      setJob(undefined);
    }
  }, [jobOptions]);

  useEffect(() => {
    if (job) {
      console.log(data[type][job]);
    } else {
      console.log(data[type]);
    }
  }, [type, job]);

  const skills = useMemo(() => {
    if (job) {
      return data[type][job] || [];
    } else if (data[type] instanceof Array) {
      return data[type];
    }
    return [];
  }, [type, job]);
  console.log(skills);

  const skillsMap = useMemo(() => {
    if (skills.length) {
      return skills.reduce((map: any, item: any) => {
        map[item.name] = item;
        return map;
      }, {});
    }
    return null;
  }, [skills]);

  /** 是否能够添加核心 */
  const addable = useMemo(() => {
    return (
      isLock && (!myNodes.length || myNodes[myNodes.length - 1]?.length === 3)
    );
  }, [isLock, myNodes]);

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <div className="flex items-center">
          <div>职业群：</div>
          <Select
            value={type}
            options={Object.keys(data).map((key) => ({ name: key }))}
            onChange={(v) => setType(v)}
          ></Select>
        </div>
        <div className="flex items-center">
          <div>职业：</div>
          <Select
            style={{ display: jobOptions.length ? "block" : "none" }}
            value={job}
            options={jobOptions}
            onChange={(v) => setJob(v)}
          ></Select>
        </div>
      </div>

      <div className="content-box p-4">
        <div className="card">
          <div className="mb-2 text-lg font-bold text-[#f7fffc]">
            被动核心一览
          </div>
          <div className="flex gap-2 flex-wrap">
            {skills.map((item: any) => (
              <div
                key={item.name}
                title={item.name}
                className={
                  needs.includes(item.name) || isLock
                    ? "cursor-not-allowed grayscale"
                    : "cursor-pointer"
                }
                onClick={() => {
                  if (needs.includes(item.name)) return;
                  const index = needs.findIndex((i) => i === null);
                  if (index !== -1) {
                    const newNeeds = [...needs];
                    newNeeds[index] = item.name;
                    setNeeds(newNeeds);
                  }
                }}
              >
                <img
                  src={item.filePath}
                  width={40}
                  height={40}
                  style={{ maxWidth: "none" }}
                ></img>
              </div>
            ))}
          </div>
        </div>

        <div className="card mt-4">
          <div className="mb-2 text-lg font-bold text-[#f7fffc]">核心需求</div>
          <div className="flex items-center gap-2 flex-wrap">
            {needs.map((item, index) => (
              <div className="relative w-10 h-10">
                {item && (
                  <>
                    {!isLock && (
                      <div
                        className="absolute -right-1 -top-1 bg-[#324c5c] rounded-full cursor-pointer border z-20"
                        onClick={() => {
                          const newNeeds = [...needs];
                          newNeeds[index] = null;
                          setNeeds(newNeeds);
                        }}
                      >
                        <XMarkIcon width={13} color="#fff"></XMarkIcon>
                      </div>
                    )}
                    <img
                      src={skillsMap[item].filePath}
                      width={40}
                      height={40}
                      style={{
                        maxWidth: "none",
                        cursor: isLock ? "pointer" : "default",
                      }}
                      className="relative z-10"
                      onClick={() => {
                        if (myNodes[myNodes.length - 1].length < 3) {
                          const newMyNodes = [...myNodes];
                          newMyNodes[myNodes.length - 1].push(item);
                          setMyNodes(newMyNodes);
                        }
                      }}
                    ></img>
                  </>
                )}
                <div
                  className={`w-10 h-10 bg-[#334c5c] rounded-md ${
                    isLock ? "" : "empty"
                  } absolute top-0 left-0`}
                  style={{ opacity: item ? 0 : 1 }}
                >
                  {isLock && (
                    <MinusCircleIcon color="#a5c1c8"></MinusCircleIcon>
                  )}
                </div>
              </div>
            ))}
            <div
              className={`button ${
                myNodes.length ? "disabled" : ""
              } font-bold text-[#f7fffc] ml-2 px-2 py-1 w-20 rounded-md text-sm cursor-pointer`}
              onClick={() => {
                if (myNodes.length) return;
                if (needs.filter(Boolean).length < 2) {
                  Swal.fire({
                    title: "至少需要选择两个核心",
                    customClass: "maple-alert",
                  });
                  return;
                }
                setIsLock(!isLock);
              }}
            >
              {isLock ? "UNLOCK" : "LOCK"}
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <div className="mb-2 text-lg font-bold text-[#f7fffc]">我的核心</div>
          <div className="flex gap-3">
            {myNodes.map((item, index) => (
              <div className="flex gap-2 flex-col py-2 px-1 border rounded-md bg-[rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.1)] relative">
                <div
                  className="absolute -right-2 -top-2 bg-[#324c5c] rounded-full cursor-pointer border z-20"
                  onClick={() => {
                    const newMyNodes = [...myNodes];
                    newMyNodes.splice(index, 1);
                    setMyNodes(newMyNodes);
                  }}
                >
                  <XMarkIcon width={13} color="#fff"></XMarkIcon>
                </div>
                {new Array(3)
                  .fill(null)
                  .map((_, subIndex) =>
                    item[subIndex] ? (
                      <img
                        src={skillsMap[item[subIndex]].filePath}
                        width={40}
                        height={40}
                        style={{ maxWidth: "none" }}
                      ></img>
                    ) : (
                      <div
                        className={`w-10 h-10 bg-[#334c5c] rounded-md empty top-0 left-0`}
                      ></div>
                    )
                  )}
              </div>
            ))}
            <div
              className="py-2 px-1 rounded-md border bg-[rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.1)] flex items-center"
              style={{
                cursor: addable ? "pointer" : "not-allowed",
                height: 154,
              }}
              onClick={() => {
                if (!addable) return;
                const newMyNodes = [...myNodes];
                newMyNodes.push([]);
                setMyNodes(newMyNodes);
              }}
            >
              <PlusIcon
                width={40}
                color={
                  addable ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.5)"
                }
              ></PlusIcon>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
