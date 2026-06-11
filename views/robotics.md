# 🦾 フィジカルAI・ロボティクス — 全アーカイブ

全12件 / 日付の新しい順

## 2026-06-11

### [ロボティクスに「ソフトウェアのLlamaの瞬間」は訪れない——物理デプロイの壁とサイトドリフトが汎用ロボットポリシーの普及を阻む](https://www.therobotreport.com/robotics-will-not-have-a-clean-llama-moment/)
*Robotics will not have a clean Llama moment*
出典: The Robot Report ・ #robotics #2026-06-11

The Robot Reportの論説は、ソフトウェアAIで起きた「Llamaの瞬間」——MetaがLlamaを公開し誰でもLLMを活用できるようになった転換点——がロボティクスでは単純に再現されないと論じる。
ソフトウェアのLlamaはチームがモデルを受け取り、縮小し、使い慣れたソフトウェアパスで動かせた。しかしロボットポリシーはそれ単独では動かない。現場の制御スタック・安全エンベロープ・インストール済みロボットのコントローラーへの変換が必要で、モデルへのアクセス拡大が「ロボットの試行範囲を広げる」だけでは不十分だという。
実際の問題は「サイトドリフト」——承認テストを通過したロボットと、顧客プロセスで稼働するロボットの間でカメラ位置・エンドエフェクタのコンプライアンス・フィクスチャ基準点・汚染蓄積などが経時的にずれる現象。ドメインランダム化も「毎日フロアが生み出す新しいバリエーション」には追いつかない。また2025年のVCはSkild AI（$14億）・Physical Intelligence（$10億超）・NEURA Robotics（$14億）・Wayve（$12億）など「ロボットポリシーが機体間で再利用可能になる前提」に$140億超を賭けているが、その前提を証明するパスがまだ確立されていない点が本質的リスクと著者は指摘する。
💡 投資含意: 汎用ロボットポリシーの実用化はソフトウェアAIより遥かに時間がかかる可能性がある。大型VCバリュエーションには楽観的前提が含まれており、実証・スケールアップで想定外の壁が出れば再評価リスク。一方「特定工程特化型」自動化は先行して収益化しうる。
🔗 波及: FANUC・安川電機など産業特化型ロボット既存企業の強みが当面継続する可能性。真の汎用化には数年単位の時間軸が必要。
📈 関連銘柄: ISRG（特化型ロボット手術・継続強気）、FANUC（産業特化型・中立〜強気）
⚖️ 弱気: 汎用ロボットスタートアップのバリュエーション前提への慎重な評価が必要

### [X Square Robot、実ロボット訓練データ量を最大20分の1に削減するオープンソース・フレームワーク「XRZero-G0」と2,000時間データセットを公開](https://www.therobotreport.com/inside-xrzero-g0-a-new-2000-hour-open-dataset-for-robotics-research/)
*Inside XRZero-G0, a new 2,000-hour open dataset for robotics research*
出典: The Robot Report ・ #robotics #2026-06-11

X Square RobotがロボットAI学習のデータボトルネック解消を目指すオープンソースフレームワーク「XRZero-G0」と、2,000時間のマルチモーダルデータセット「G0-Dataset」を公開した。
現状のロボット学習の最大課題は「実機でのデータ収集コスト」であり、全世界のロボット操作データは約30万時間しかない（テキストデータの300兆トークンと比べて桁違いに少ない）。XRZero-G0はVR対応ウェアラブルハードウェア（頭部カメラ＋手首2台カメラ）を使い、実ロボット不要でのデータ収集を実現する。実験条件下で「約10エピソードのロボット不要データ＋1エピソードの実機データ」が、純粋な実機データセットと同等の性能を達成できるという。
データ品質管理の面では「収集→品質検査→訓練→評価」の閉ループパイプラインを構築し、異なるロボット機体（cross-embodiment）へのポリシー転用を標準化。ハードウェア設計・品質検査パイプライン・訓練手法・データセットをすべてGitHub/HuggingFaceで公開する。
「データボトルネック」が緩和されれば、汎用ロボット普及の最大の障壁の一つが解消される。実機なしで高品質データを集められる手法は、資本の少ないスタートアップや研究機関の参入を容易にし、ロボティクス開発のデモクラタイゼーションを加速する。
💡 投資含意: ロボット訓練データコストの低下は汎用ロボット普及を加速させ、センサー・GPU・産業機器全体への需要増加につながる。ロボティクスの参入障壁低下は市場拡大の好材料。
🔗 波及: NVIDIA Isaac Sim・OpenVLA・Physical Intelligence等の汎用ポリシー研究との相乗効果で、実証から量産展開への移行が加速する可能性。
📈 関連銘柄: NVDA（ロボットAI基盤・強気）
⚖️ 強気: ロボティクス研究加速・汎用ロボット普及進展に寄与

## 2026-06-10

### [NEURAロボティクス、NVIDIAとAmazonから最大14億ドルのシリーズCを調達——欧州発の人型ロボット企業がグローバル展開加速](https://www.therobotreport.com/neura-robotics-raise-up-1-4b-in-series-c-funding-physical-ai/)
*NEURA Robotics to raise up to $1.4B in Series C funding for physical AI*
出典: The Robot Report ・ #robotics #2026-06-10

ドイツ・Metzingen拠点のNEURA Roboticsが、NVIDIAとAmazonを含む戦略投資家から最大14億ドルのシリーズCラウンドを発表した。人型ロボット（4NE1）・モバイルロボット（MAV）・軽量ロボットアームに加え、AIロボット学習基盤「Neuraverse」の構築を手掛ける。
投資家構成が極めて多様で戦略的な点が特徴。NVIDIA、Amazon、Qualcomm（エッジAI）、Bosch、Schaeffler（精密機械）、欧州投資銀行（EIB）、暗号資産企業Tetherまで参加しており、製造・物流・金融の各側面から「フィジカルAIのインフラ」としての期待を集める。1月にBoschとの人型ロボットソフトウェア開発提携、4月にDassault Systèmesとのsim-to-real格差縮小提携なども続いており、エコシステム形成が急ピッチ。
同社は既存受注残と戦略展開パイプラインが10億ドル超と主張。CEOのRegerは「シリコンバレー以外からもAIインフラ企業が生まれ得ることを証明する」と主張し、Figure・1X・Unitree（宇樹）など米中有力企業への対抗を示唆。
製造と物流の自動化に向けた人型ロボット競争に欧州勢が本格参入したことは、米中二極構造に変化をもたらす可能性がある。Qualcommのコメントにある通り「知覚・推論・即時動作をオンデバイスで行う最も高度なエッジAIユースケース」として、人型ロボットは半導体・センサー・ソフトウェア全体への需要を生む。
💡 投資含意: NVIDIAがロボット会社への直接出資（戦略投資）を進めており、Isaac Sim/Jetsonプラットフォームの市場拡大が加速。AmazonもAWS・物流自動化の観点から参画しており、倉庫ロボット化の波が続く。
🔗 波及: 人型ロボット製造には半導体（NVDA）・精密部品（Schaeffler/FANUC等）・センサー（Bosch）が大量に必要で、サプライチェーン全体に恩恵。Qualcommはエッジ推論チップの主要サプライヤーとして位置付け。
📈 関連銘柄: NVDA（物理AIエコシステム拡張・強気）、AMZN（ロジスティクス自動化加速・強気）、QCOM（エッジAI需要・強気）
⚖️ 強気: 人型ロボット・フィジカルAIセクター全体に強気材料

### [NVIDIA、ロボタクシー向け安全OS「Halos OS」を発表——ISO 26262 ASIL D認定の量産対応スタック](https://blogs.nvidia.com/blog/halos-os-robotaxi-safety/)
*For Robotaxis, Safety Must Be Built In, Not Bolted On*
出典: NVIDIA Robotics ・ #robotics #2026-06-10

NVIDIAが自動運転車（ロボタクシー）向けの統合安全オペレーティングシステム「Halos OS」を正式発表した。NVIDIA DRIVE Hyperionプラットフォーム上に構築された量産対応の安全基盤で、単なるソフトウェアコンポーネントではなくOS・SDK・アプリ・クラウドインフラを包括する4層構造を持つ。
背景として、ロボタクシー産業はWaymo等が商業展開段階に移行しており、規制当局と認証機関が「性能が高い」だけでなく「システム全体の信頼性・フォールト分離・動作境界の証明」を求めている。従来は「安全ガードレールを後付けする」設計が多かったが、Halos OSは「最初から安全性を組み込む」（built-in not bolted-on）アーキテクチャを標榜。
Halos Coreは次世代NVIDIA DriveOS。ISO 26262 ASIL D（自動車安全最高規格）認定済みで、NVIDIA CUDAとTensorRT安全認定版を含む。ハイパーバイザー（安全クリティカル機能を隔離し、障害が車両制御に到達しない設計）を内蔵。Halos SDKはセンサー抽象化層（カメラ・レーダー・LiDARを統一インターフェースで扱う）と車両抽象化層を提供。Halos Applicationsには自動緊急ブレーキ・車線逸脱警告など従来のADASに加え、NVIDIAが新たに公開したAlpamayoオープンモデル族（自動運転向け連鎖思考推論）を統合できる。
Halos Infraはクラウド側のトレーニング・シミュレーション・バリデーション環境で、今月別途発表されたHalos Safety Evaluation Framework（330本以上の研究論文・1,000件以上の特許に基づく）と連携。
NVIDIAはハードウェア（GPU・DRIVE Hyperion）から安全認定OS・SDKまでを一体で提供することで、自動運転スタックの「NVIDIA化」によるスイッチングコスト向上を狙う戦略が鮮明。
💡 投資含意: NVIDIAが自動運転OSレイヤーまで支配することで、Qualcomm Snapdragonやモービルアイとの競合軸が「ハードウェア性能」から「認定済みソフトウェアスタック」へと移行する。自動運転参入企業はNVIDIAのエコシステムを採用するインセンティブが高まる。
🔗 波及: センサー企業（LiDAR等）はHalos SDK対応が競争力の前提条件に。自動運転スタートアップはNVIDIA Halos OS採用でTier 1認証コストを削減できる→参入加速。
📈 関連銘柄: NVDA（自動運転スタック覇権確立・強気）、LAZR（センサー対応次第・中立）、MBLY（Halos競合・若干弱気）
⚖️ 強気: NVDAの自動運転エコシステム支配力強化に強気材料

## 2026-06-09

### [Walmart×Wing、ドローン配送を7市場に拡大——累計100万件突破、2027年末に4000万人カバー目標](https://www.therobotreport.com/walmart-wing-add-7-markets-in-drone-delivery-expansion/)
*Walmart, Wing add 7 markets in drone delivery expansion*
出典: The Robot Report ・ #robotics #2026-06-09

WalmartとAlphabet傘下のWingがドローン配送をメンフィス・ニューオーリンズ・フィラデルフィア・フェニックス・サンディエゴ・サンフランシスコ湾岸・ソルトレイクシティの7市場に拡大すると発表した。Wing全体での累計配送数は100万件を突破し、2027年末までに4000万人のアメリカ人がサービスを利用できる目標を掲げる。今回の7市場追加は南部・西部中心だった展開地域を北東部・太平洋岸にまで広げる動きで、商用スケールアップの加速を示す。

💡 投資含意: WalmartとGoogleの提携によるドローン配送の急拡大はラストマイル物流コスト低減に直結する。Google（Alphabet）とWalmartの両社にとって競争優位となりうる。
🔗 波及: ドローン配送の本格スケールはAmazon・FedEx・UPSの配送事業モデルへの競争圧力を高める。
📈 関連銘柄: GOOGL（Alphabet/Wing・強気）、WMT（Walmart・強気）
⚖️ 強気材料（GOOGL Wing・WMT eコマース物流）
📅 次の注目: FAA規制対応・競合他社のドローン配送市場参入状況

### [Standard Botsが2億ドルシリーズCを完了——評価額10億ドル、NYで7万平方フィート拡張、AI教示型ロボット量産へ](https://www.therobotreport.com/standard-bots-raises-200m-expand-u-s-manufacturing-footprint/)
*Standard Bots raises $200M to expand U.S. manufacturing footprint*
出典: The Robot Report ・ #robotics #2026-06-09

AIネイティブ型産業ロボットスタートアップのStandard Botsが2億ドルのシリーズCを完了し、評価額10億ドルのユニコーンとなった。ニューヨーク州グレンコーブで7万平方フィートの製造・展示拠点を拡張し、米国製造業への雇用・設備投資を強調している。同社のロボットは「教示ベース」のAI学習を採用しており、エンジニア不要でオペレーターが直接動作を教えられる設計が特徴。フォーチュン100企業から中小製造業まで幅広い顧客層を持ち、米国製造回帰（リショアリング）の流れを直接取り込む戦略をとっている。

💡 投資含意: 米国製造業回帰トレンドの受益株として中小製造業向けAIロボット市場に注目。SMEへの裾野拡大は市場規模拡大の鍵となる。
🔗 波及: リショアリング加速に伴う産業ロボット需要増大は部品・センサーサプライチェーン全体に恩恵をもたらす。
📈 関連銘柄: NVDA（AI推論チップ・ロボット向け）、ROK（Rockwell Automation・産業オートメーション競合/受益）
⚖️ 強気材料（米国製造回帰・AIネイティブ産業ロボット市場）
📅 次の注目: グレンコーブ施設の稼働開始・IPO検討の有無

### [超党派「国家ロボット委員会」設立法案が前進——中国は米国の9倍のロボットを稼働、業界が一枚岩で支持](https://www.therobotreport.com/effort-establish-national-commission-on-robotics-advances-congress/)
*Effort to establish a National Commission on Robotics advances in Congress*
出典: The Robot Report ・ #robotics #2026-06-09

上院でMcCormick（共和党）・Hickenlooper（民主党）による超党派「National Commission on Robotics」設立法案が前進した。2025年時点でアメリカより9倍多いロボットを中国が稼働させているとのデータを背景に、Boston Dynamics・Agility Robotics・Locus Roboticsなど業界大手が支持を表明している。委員会は米国のロボット政策を一元的に統括する機関として位置づけられ、連邦レベルの明確なロボット投資・規制フレームワーク策定に向けた重要な一歩となる。

💡 投資含意: 米国のロボット産業政策が明確化されることで、国防・製造・物流向けロボット企業は長期的な事業計画を立てやすくなる。連邦調達・補助金政策の整備につながる可能性がある。
🔗 波及: 中国ロボット産業との競争を意識した政策強化はサプライチェーン国産化・部品調達先の選別にも波及しうる。
📈 関連銘柄: NVDA（ロボットAI）、TER（Teradyne/Universal Robots親会社）
⚖️ 強気材料（米国ロボット産業政策整備・長期）
📅 次の注目: 法案の本会議採決・委員会メンバーの選定プロセス

### [AGILINKがICRA 2026で「接触知能」を実証——風船アニマル操作デモとOmniHand 3 Ultra-M（20自由度・0.005N触覚分解能）を発表](https://spectrum.ieee.org/agilink-contact-intelligence-robot-manipulation)
*Beyond Dexterity: Why Contact May Define the Next Era of Robotics*
出典: IEEE Spectrum Robotics ・ #robotics #2026-06-09

AGILINKがICRA 2026（ウィーン）で「接触知能（contact intelligence）」を中核に据えた2つのデモを披露した。目玉は風船アニマル作り：高変形・高摩擦感度の風船を破裂させずにねじり続けるタスクで、長期シーケンス実行（motion intelligence）と接触維持（contact intelligence）の両立を実証した。専業バルーンアーティストからの人間デモと失敗復帰事例を収集し強化学習でポリシーを構築している。同時発表のOmniHand 3 Ultra-Mは20自由度・完全直接駆動を採用し、力制御帯域幅と透明性を向上。300以上の3D触覚センシングポイントが掌全体に分布し、個別センサーの力分解能は約0.005 N（紙1枚の重さ相当）、空間分解能0.04 mm、感覚点密度5万点/cm²を実現する。ケーブル挿入・衣類処理・コネクタ嵌合など自動化困難タスクの突破口となりうる。

💡 投資含意: 接触知能は従来の産業ロボットが苦手とする非構造環境タスクを切り開く。直接駆動・高密度触覚センシングを組み合わせた商業製品の登場は、製造・物流・医療向けロボット市場の次の成長波を示唆する。
🔗 波及: AGILINKの技術路線はBoston Dynamics・Figure・Physical Intelligenceなど人型・ドエクスタラス系スタートアップ全体のハードウェア要求水準を引き上げる。
📈 関連銘柄: NVDA（AI推論インフラ）、ABB・FANUC（既存産業ロボット競合/受益）
⚖️ 強気材料（ロボット接触知能商業化の前進）
📅 次の注目: OmniHand 3 Ultra-Mの商用リリーススケジュール・実作業ベンチマーク結果

## 2026-06-08

### [Daimon Robotics・Galbot、触覚センシング特化の世界初ロボット評価ベンチマーク「RobOmni」をICRA2026で発表](https://www.therobotreport.com/daimon-robotics-and-galbot-jointly-launches-robomni-for-benchmarking-tactile-perception-and-dexterous-manipulation/)
*Daimon Robotics and Galbot jointly launches RobOmni for benchmarking tactile perception and dexterous manipulation*
出典: The Robot Report ・ #robotics #2026-06-08

香港のDaimon RoboticsとGalbotが、触覚センシングを含む世界初の全モーダル型ロボット評価ベンチマーク「RobOmni」をICRA2026（国際ロボット自動化会議）で発表した。Physical AIにおける触覚の価値を定量化する標準インフラが業界に存在しなかった空白を埋める試みだ。
視覚だけでは捉えられない「接触力・変形・スリップ・素材特性・テクスチャ・硬軟」といった物理インタラクションは、把持・挿入・組み立て・精密配置タスクで不可欠な情報だ。しかしこれまで業界には触覚センシングの価値を定量評価できる統一ベンチマークがなく、異なるアプローチを比較する共通基盤がなかった。
RobOmniはNVIDIA Isaac Simをベースに構築された高忠実度シミュレーション環境で、数十種の接触リッチな操作タスクを収録。触覚あり/なしのアブレーションテストで「触覚センシングが実際にタスク成功率をどれほど改善するか」を直接測定できる。ヒューマノイドロボットとロボットアームの両方を対象とした大規模並列評価にも対応する。
ロボティクスの評価インフラを誰が標準化するかは、研究方向性・ハードウェア選定・規制基準に直接影響する。NVIDIA Isaac Simを核にした設計はNVIDIAのロボット開発エコシステム優位を強化し、本日発表されたNVIDIA-LG・NVIDIA-Doosan連携と合わせてNVIDIAがデファクトスタンダードとなるシナリオをさらに補強する。

💡 投資含意: 触覚センシングの評価インフラが整備されることで触覚センサーハードウェアの商用化が加速。ロボットハンド・グリッパーの精度向上による産業用ロボットの適用範囲拡大につながる。
🔗 波及: Isaac Simベースのベンチマーク普及はNVIDIAのロボット開発エコシステムを強化。ABB・Rockwell Automationなど産業用ロボット大手が触覚センサー搭載を加速させる可能性。
📈 関連銘柄: NVDA（Isaac Sim・ロボット推論基盤）、ABB・ROK（産業用ロボット受益）
⚖️ 強気材料（フィジカルAI・触覚センシング分野全体）

### [対ドローン自律兵器のACS、シリーズBで2億ドル調達——評価額22億ドル、米陸軍・海軍への実戦展開が進む](https://www.therobotreport.com/allen-control-systems-raises-200m-for-autonomous-weapons-stations/)
*ACS raises $200M to scale autonomous counter-drone system*
出典: The Robot Report ・ #robotics #2026-06-08

自律型対ドローン兵器システムを開発するアレン・コントロール・システムズ（ACS）がシリーズBで2億ドルを調達し、評価額22億ドルに達した。調達資金は製造拡大と「Bullfrog」の量産・展開加速に充てる。
ウクライナ・中東・インド太平洋において低コストのFPVドローン・自爆型UAVが戦場の主役となる中、ミサイルで数ドルのドローンを迎撃するコスト非合理性が深刻な問題となっている。従来の防空システムとの非対称コスト問題を解決する「弾薬ベースの自律迎撃」への需要が急拡大している。
BullfrogはAI・コンピュータビジョン・精密ロボティクスを組み合わせた軽量自律型武器ステーションで、グループ1〜3の無人機（重量25kg以下）を自律・半自律で無力化できる。2026年技術実証実験（T-REX 26-1）で100%の迎撃成功率を記録し、既に米陸軍・海軍への実戦展開が始まっている。Joint Interagency Task Force 401経由で政府契約を保有している。
CEOは「世界中に豊富にある弾薬を活用したスケーラブルなソリューション」と位置付け、オースティン拠点の製造を拡充する。イラン戦争・ウクライナ紛争が同時進行する現在、対ドローン防衛AIスタートアップへの防衛省調達と民間投資の両方が加速している。

💡 投資含意: AIを活用した自律型防衛システムへの政府支出増加は継続的なテーマ。対ドローン分野での防衛AIスタートアップIPOや大手防衛企業による買収が見込まれる。
🔗 波及: BullfrogのようなAI自律型兵器の普及はAEROVironment（AVAV）・L3Harris・Teledyne FLIRなど既存ドローン対処ソリューション企業との競合を激化させつつ、NVIDIA Jetsonなど防衛AI推論チップ需要を押し上げる。
📈 関連銘柄: AVAV（ドローン対処）、LMT・RTX・NOC（大手防衛、対ドローン需要）、NVDA（防衛AI推論チップ）
⚖️ 強気材料（防衛AI・対ドローンセクター）
📅 次の注目: ACSのIPO or 大手防衛企業による買収動向・次期政府調達契約

### [NVIDIAとLGグループ、フィジカルAIファクトリー構築で包括協業——家庭用ロボット・自動運転・AIデータセンターを一体展開](https://blogs.nvidia.com/blog/nvidia-and-lg-group-ai-factory/)
*NVIDIA and LG Group Build an AI Factory to Advance Physical AI, Mobility and AI Factory*
出典: NVIDIA Robotics ・ #robotics #2026-06-08

NVIDIAとLGグループが、ロボティクス・自動運転・データセンター技術・GPUクラウドサービスをカバーする包括的なAIファクトリー構築で協業を発表した。韓国最大の家電・素材コングロマリットを丸ごとNVIDIAエコシステムへ統合する規模感だ。
LGエレクトロニクスはNVIDIA Isaac Sim/Isaac Lab・GR00T（推論VLAモデル）を家庭用ロボット「CLoiD」に統合し、韓国・グローバル企業向けの「フィジカルAIデータファクトリー」を構築する。合成データ生成にはNVIDIA Cosmos世界基盤モデルを活用。LGイノテックは光学センサーをNVIDIA向けに最適化し、LG CNSはPhysicalWorks産業ロボットプラットフォームにNVIDIA Isaacを統合する。
AIファクトリーインフラ面では、LG U+がNVIDIA DSXベースのAIデータセンターを構築し、LGエナジーソリューションが800V DC対応の次世代データセンター電力ソリューションでNVIDIAと協力。モビリティ面ではLGエレクトロニクスのADASがNVIDIA DRIVEプラットフォームに統合される。さらにLG AI ResearchはEXAONE主権AIモデルの開発でNVIDIAと協調する。
NVIDIAにとってこの連携は「部品から電力・クラウドまで」を担う垂直統合サプライヤーを自社エコシステムに取り込む戦略的な一手。Cosmosモデルの商用化データ供給源として韓国製造業大手を確保する構造でもある。

💡 投資含意: NVIDIAのフィジカルAIエコシステムが韓国大手に浸透することで、Isaac/Cosmos/GR00Tの商用採用事例が蓄積され、エンタープライズロボティクス市場での優位を固める。
🔗 波及: LGイノテックの光学センサーがNVIDIA向けに最適化されることで、ロボット用センサーのスタンダード化に影響。韓国製造業全体のAI化に波及。
📈 関連銘柄: NVDA（直接的な最大受益者）
⚖️ 強気材料（NVDA・フィジカルAIインフラ全体）
📅 次の注目: LGフィジカルAIデータファクトリーの稼働開始・Cosmosの商用採用拡大

### [NVIDIAとドゥサングループが協業拡大——産業ロボット・建設機械・SMR電力・PCB素材までAIファクトリー全体をカバー](https://blogs.nvidia.com/blog/nvidia-and-doosan-group-physical-ai/)
*NVIDIA and Doosan Group Collaborate to Advance Physical AI and AI Factory Infrastructure*
出典: NVIDIA Robotics ・ #robotics #2026-06-08

NVIDIAとドゥサン（斗山）グループが、産業ロボット・建設機械・エネルギー・先端素材という4事業分野にまたがるPhysical AI・AIファクトリー協業を発表した。
ドゥサンロボティクスはNVIDIA Isaac Sim/Lab・Cosmos・Newtonエンジン・Jetson ThorをAgenticロボットOSに統合し、知覚・推論・シミュレーション・オンデバイス推論が連動する産業用ロボットを開発する。デパレタイジング・サンディングなどの高付加価値作業向け参照ユースケースを共同開発し、デュアルアーム・ヒューマノイド形態のロボットも視野に入れる。
特に注目されるのはドゥサンエナービリティのAIファクトリー電力供給への参画だ。ガスタービン・蒸気タービンに加え、小型モジュール炉（SMR）と水素燃料電池をデータセンター電源として活用する可能性を探っている。AIデータセンターの電力需要と原子力エネルギーの交点は業界初期段階だが、長期投資テーマとして注目度が高まっている。ドゥサンコーポレーション電子素材はAIサーバーのPCB向け高性能CCL（銅張積層板）を提供し、AIファクトリーサプライチェーンの素材レイヤーも担う。
ドゥサンボブキャット（建設・農業機械）はNVIDIA物理AIを統合した自律型コンパクト装備の開発を探索。ロボットから電力・PCB素材まで包括的に自社エコシステムへ統合するNVIDIAの戦略の韓国第二弾（同日のLGとの発表と対をなす）。

💡 投資含意: SMRをAIデータセンターの電力源として検討する動きは、小型炉セクターへの注目を高める。NVIDIAのAIファクトリー電力需要とSMRの交点は長期投資テーマとして評価が高まりつつある。
🔗 波及: ドゥサンのCCL素材がAIサーバー向けに採用されれば、PCB材料サプライヤー全体の需要増加を示す先行指標となる。建設・農業機械の自律化は関連半導体・センサー需要を増大させる。
📈 関連銘柄: NVDA（全体の受益者）、CCJ・NuScale Power（SMR/原子力とAI電力の交点）
⚖️ 強気材料（NVDA・物理AI・SMR長期テーマ）
