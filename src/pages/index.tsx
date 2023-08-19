import Select from "@/components/Select";
import { useEffect, useMemo, useState } from "react";
import "./index.less";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CubeTransparentIcon,
  MinusCircleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import _Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { calculate } from "./calculate";
import data1 from "./data1.json";
import { typeObj, picObj } from "./config";
import musheroom from "./stand.gif";
import thanks from "./thanks.jpeg";

const Swal = withReactContent(_Swal);

const needTypeArr = ["三核五技", "四核六技", "五核八技", "六核九技"];
const skillNumMap = {
  [needTypeArr[0]]: 5,
  [needTypeArr[1]]: 6,
  [needTypeArr[2]]: 8,
  [needTypeArr[3]]: 9,
};

export default function HomePage() {
  const [type, setType] = useState(Object.keys(typeObj)[0]);
  const [job, setJob] = useState<string>();
  const [needType, setNeedType] = useState(needTypeArr[0]);
  const [needs, setNeeds] = useState<(null | string)[]>(
    new Array(9).fill(null)
  );
  const [isLock, setIsLock] = useState(false);
  const [myNodes, setMyNodes] = useState<string[][]>([]);
  const [assistNode, setAssistNode] = useState<string | null>(null);
  const [nodePage, setNodePage] = useState(1);
  const [result, setResult] = useState<string[][]>([]);
  const [resultHint, setResultHint] = useState("空空如也");

  useEffect(() => {
    // 缓存处理
    const _cache = JSON.parse(localStorage.getItem("cache") || "{}");
    if (job) {
      setNeedType(_cache[job]?._needType || needTypeArr[0]);
      setNeeds(_cache[job]?._needs || new Array(9).fill(null));
      setIsLock(_cache[job]?._isLock || false);
      setMyNodes(_cache[job]?._myNodes || []);
      setAssistNode(_cache[job]?._assistNode || null);
      setNodePage(_cache[job]?._nodePage || 1);
    }
  }, [type, job]);

  useEffect(() => {
    if (job) {
      const _cache = JSON.parse(localStorage.getItem("cache") || "{}");
      const cache = {
        ..._cache,
        [job!]: {
          _needType: needType,
          _needs: needs,
          _isLock: isLock,
          _myNodes: myNodes,
          _assistNode: assistNode,
          _nodePage: nodePage,
        },
      };
      localStorage.setItem("cache", JSON.stringify(cache));
    }
  }, [needType, needs, isLock, myNodes, assistNode, nodePage]);

  const jobOptions = useMemo(() => {
    const t = typeObj[type];
    return t.map((item) => ({ name: item.chName + "(" + item.enName + ")" }));
  }, [type]);

  useEffect(() => {
    if (jobOptions.length) {
      setJob(jobOptions[0].name);
    } else {
      setJob(undefined);
    }
  }, [jobOptions]);

  const skills = useMemo(() => {
    if (job) {
      return data1[job.match(/(\w|\s|,)+/)![0]] || [];
    }
    return [];
  }, [job]);

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

  const pageArr = useMemo(() => {
    return new Array(Math.ceil((myNodes.length || 1) / 12)).fill(0);
  }, [myNodes]);

  return (
    <div
      className="p-4 flex flex-col justify-center min-h-screen gap-6"
      style={{
        background: `url(${
          picObj?.[job?.match(/(\w|\s|,)+/)![0]!]
        }) no-repeat center / contain`,
      }}
    >
      <div className="flex gap-4 justify-center relative z-40">
        <div className="flex items-center">
          <div>职业群：</div>
          <Select
            value={type}
            options={Object.keys(typeObj).map((key) => ({ name: key }))}
            onChange={(v) => setType(v)}
          ></Select>
        </div>
        {!!jobOptions.length && (
          <div className="flex items-center">
            <div>职业：</div>
            <Select
              style={{ display: jobOptions.length ? "block" : "none" }}
              value={job}
              options={jobOptions}
              onChange={(v) => setJob(v)}
            ></Select>
          </div>
        )}
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
                  needs.includes(item.name) ||
                  isLock ||
                  needs.filter(Boolean).length === skillNumMap[needType]
                    ? "cursor-not-allowed grayscale"
                    : "cursor-pointer"
                }
                onClick={() => {
                  if (
                    needs.includes(item.name) ||
                    needs.filter(Boolean).length === skillNumMap[needType]
                  )
                    return;
                  const index = needs.findIndex((i) => i === null);
                  if (index !== -1) {
                    const newNeeds = [...needs];
                    newNeeds[index] = item.name;
                    setNeeds(newNeeds);
                  }
                }}
              >
                <img
                  src={item?.pic}
                  width={40}
                  height={40}
                  style={{ maxWidth: "none" }}
                ></img>
              </div>
            ))}
          </div>
        </div>

        <div className="card mt-4">
          <div className="flex gap-2">
            <div className="mb-2 mr-2 text-lg font-bold text-[#f7fffc]">
              核心需求
            </div>
            {needTypeArr.map((type) => (
              <div
                className="mt-2 text-xs cursor-pointer h-5"
                key={type}
                style={{
                  color:
                    type === needType
                      ? "rgba(255,255,255,0.8)"
                      : "rgba(255,255,255,0.5)",
                  textShadow: type === needType ? "0 0 5px #1E94C4" : undefined,
                }}
                onClick={() => {
                  // 锁定或已经添加我的核心时无法切换
                  if (myNodes.length || isLock) return;
                  // 四核六核六核九清除次要技能
                  if (type === needTypeArr[1] || type === needTypeArr[3]) {
                    setAssistNode(null);
                  }
                  setNeedType(type);
                }}
              >
                {type}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {needs.map((item, index) => (
              <div className="relative w-10 h-10" key={index}>
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
                    <div
                      className="cursor-pointer relative z-10"
                      onClick={() => {
                        if (
                          myNodes?.[myNodes?.length - 1]?.length < 3 &&
                          !myNodes?.[myNodes?.length - 1]?.includes(item)
                        ) {
                          const newMyNodes = [...myNodes];
                          newMyNodes[myNodes.length - 1].push(item);
                          setMyNodes(newMyNodes);
                        }
                      }}
                    >
                      <img
                        src={skillsMap?.[item]?.pic}
                        width={40}
                        height={40}
                        style={{
                          maxWidth: "none",
                          cursor: isLock ? "pointer" : "default",
                          filter: myNodes?.[myNodes?.length - 1]?.includes(item)
                            ? "grayscale(1)"
                            : undefined,
                        }}
                      ></img>
                    </div>
                  </>
                )}
                <div
                  className={`w-10 h-10 bg-[#334c5c] rounded-md ${
                    index + 1 > skillNumMap[needType] ? "" : "empty"
                  } absolute top-0 left-0`}
                  style={{ opacity: item ? 0 : 1 }}
                >
                  {index + 1 > skillNumMap[needType] && (
                    <MinusCircleIcon color="#a5c1c8"></MinusCircleIcon>
                  )}
                </div>
              </div>
            ))}
            <div
              className={`button ${
                myNodes.length ? "disabled" : ""
              } font-bold text-[#f7fffc] ml-2 px-2 py-1 w-20 rounded-md text-sm cursor-pointer`}
              onClick={async () => {
                if (myNodes.length) return;
                if (needs.filter(Boolean).length < skillNumMap[needType]) {
                  Swal.fire({
                    title: "请先完善核心需求",
                    customClass: "maple-alert",
                  });
                  return;
                }
                if (
                  (needType === needTypeArr[0] ||
                    needType === needTypeArr[2]) &&
                  !isLock
                ) {
                  let t = needs[0];
                  await Swal.fire({
                    title: (
                      <div>
                        <div className="mb-2">选择一个次要技能</div>
                        <div className="flex gap-2 justify-center">
                          {needs.filter(Boolean).map((item, index) => {
                            return (
                              <div
                                tabIndex={1}
                                key={index}
                                ref={(e) => {
                                  if (index === 0) {
                                    e?.focus();
                                  }
                                }}
                                className="round-md border-2 border-[#fff] focus:border-[#000] p-1 rounded-md"
                              >
                                <img
                                  src={skillsMap[item!]?.pic}
                                  width={40}
                                  height={40}
                                  style={{
                                    maxWidth: "none",
                                  }}
                                  className="relative z-10 cursor-pointer"
                                  onClick={() => {
                                    t = item;
                                  }}
                                ></img>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ),
                    showCancelButton: true,
                    customClass: "maple-alert",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      setIsLock(!isLock);
                      setAssistNode(t);
                    }
                  });
                } else {
                  setIsLock(!isLock);
                }
              }}
            >
              {isLock ? "UNLOCK" : "LOCK"}
            </div>
            {assistNode && (
              <>
                <div className="ml-2 text-white text-sm">次要技能:</div>
                <img
                  src={skillsMap?.[assistNode!]?.pic}
                  width={40}
                  height={40}
                  style={{ maxWidth: "none" }}
                ></img>
              </>
            )}
          </div>
        </div>

        <div className="card mt-4">
          <div className="mb-2 text-lg font-bold text-[#f7fffc]">我的核心</div>
          <div className="flex justify-between">
            <div className="flex gap-3">
              {myNodes
                .slice(0 + (nodePage - 1) * 12, nodePage * 12)
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-2 flex-col py-2 px-1 border rounded-md bg-[rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.1)] relative"
                  >
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
                    {new Array(3).fill(null).map((_, subIndex) =>
                      item[subIndex] ? (
                        <img
                          key={subIndex}
                          src={skillsMap?.[item[subIndex]]?.pic}
                          width={40}
                          height={40}
                          style={{
                            maxWidth: "none",
                          }}
                        ></img>
                      ) : (
                        <div
                          key={subIndex}
                          className={`w-10 h-10 bg-[#334c5c] rounded-md empty top-0 left-0`}
                        ></div>
                      )
                    )}
                  </div>
                ))}
            </div>
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
                if (myNodes.length && myNodes.length % 12 === 0) {
                  setNodePage(nodePage + 1);
                }
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
          <div className="flex gap-2 mt-2 justify-center items-center">
            <ChevronLeftIcon
              className="cursor-pointer border border-[rgba(255,255,255,0.1)] rounded-sm mr-1"
              color={
                nodePage !== 1
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(255,255,255,0.5)"
              }
              style={{
                borderColor:
                  nodePage !== 1
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.1)",
              }}
              width={16}
              onClick={() => {
                if (nodePage !== 1) setNodePage(nodePage - 1);
              }}
            ></ChevronLeftIcon>
            {pageArr.map((_, index) => (
              <div
                key={index}
                className="rounded-full bg-black w-1 h-1"
                style={{
                  background:
                    nodePage === index + 1
                      ? "rgba(255, 255, 255, 0.8)"
                      : "rgba(255, 255, 255, 0.5)",
                  boxShadow:
                    nodePage === index + 1 ? "0 0 5px 0 #fff" : undefined,
                }}
              ></div>
            ))}
            <ChevronRightIcon
              className="cursor-pointer border rounded-sm ml-1"
              color={
                nodePage !== pageArr.length
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(255,255,255,0.5)"
              }
              style={{
                borderColor:
                  nodePage !== pageArr.length
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.1)",
              }}
              width={16}
              onClick={() => {
                if (nodePage !== pageArr.length) setNodePage(nodePage + 1);
              }}
            ></ChevronRightIcon>
          </div>
        </div>

        <div className="card mt-4">
          <div className="mb-2 text-lg font-bold text-[#f7fffc]">计算结果</div>
          <div className="flex gap-3 mt-2 justify-center h-[153px]">
            {result.length ? (
              result.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-2 flex-col py-2 px-1 border rounded-md bg-[rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.1)] relative"
                >
                  {new Array(3).fill(null).map((_, subIndex) =>
                    item[subIndex] ? (
                      <img
                        src={skillsMap[item[subIndex]]?.pic}
                        width={40}
                        height={40}
                        style={{
                          maxWidth: "none",
                        }}
                      ></img>
                    ) : (
                      <div
                        className={`w-10 h-10 bg-[#334c5c] rounded-md empty top-0 left-0`}
                      ></div>
                    )
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col justify-center items-center gap-2">
                <CubeTransparentIcon
                  width={80}
                  color="#fff"
                  className="opacity-50"
                ></CubeTransparentIcon>
                <div className="text-white opacity-50">{resultHint}</div>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-2 gap-2">
            <div
              className={`button ${
                myNodes.length ? "" : "disabled"
              } font-bold text-[#f7fffc] px-2 py-1 w-20 rounded-md text-sm cursor-pointer`}
              onClick={() => {
                if (myNodes.length) {
                  const r = calculate(
                    myNodes,
                    {},
                    1,
                    0,
                    Math.floor(needs.filter(Boolean).length / 2) + 1,
                    [],
                    assistNode
                  );
                  if (r && r.length) {
                    const arr: string[][] = [];
                    r.forEach((i) => {
                      arr.push(myNodes[i]);
                    });
                    setResult(arr);
                  } else {
                    setResult([]);
                    setResultHint("没有完美组合");
                  }
                }
              }}
            >
              计算
            </div>
            <div
              className={`button font-bold text-[#f7fffc] px-2 py-1 w-20 rounded-md text-sm cursor-pointer`}
              onClick={() => {
                Swal.fire({
                  title: "确认清空数据？",
                  showCancelButton: true,
                }).then((res) => {
                  if (res.isConfirmed) {
                    setNeeds(new Array(9).fill(null));
                    setIsLock(false);
                    setMyNodes([]);
                    setAssistNode(null);
                    setNodePage(1);
                    const _cache = JSON.parse(
                      localStorage.getItem("cache") || "{}"
                    );
                    delete _cache[job!];
                    localStorage.setItem("cache", JSON.stringify(_cache));
                  }
                });
              }}
            >
              清空数据
            </div>
          </div>
        </div>

        <div className="mt-2 flex gap-4 items-center">
          <img style={{ transform: "rotateY(180deg)" }} src={musheroom}></img>
          <div className="text-white">
            Tips: 如果发现什么bug可以到我的
            <a
              target="_blank"
              className="text-yellow-300"
              href="https://github.com/Soundmark/maple-nodes"
            >
              github仓库
            </a>
            中给我提issue，如果觉得好用并且想鼓励一下作者的话可以给作者的仓库点个小星星或者给作者一点
            <span
              className="text-yellow-300 cursor-pointer"
              onClick={() => {
                Swal.fire({
                  title: <img src={thanks}></img>,
                  showConfirmButton: false,
                });
              }}
            >
              打赏
            </span>
            🥺。
          </div>
        </div>
      </div>
    </div>
  );
}
