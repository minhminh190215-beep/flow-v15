<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flow Gen V15 - Ultimate</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --bg-primary: #0a0a0b; --bg-secondary: #111113; --bg-tertiary: #18181b; --bg-card: #141416;
            --border-color: #27272a; --border-light: #3f3f46;
            --text-primary: #fafafa; --text-secondary: #a1a1aa; --text-muted: #71717a;
            --accent-green: #22c55e; --accent-cyan: #06b6d4; --accent-purple: #a855f7;
            --accent-yellow: #eab308; --accent-red: #ef4444; --accent-orange: #f97316;
        }
        body { font-family: 'Inter', sans-serif; background: var(--bg-primary); color: var(--text-primary); min-height: 100vh; }
        
        .app { display: grid; grid-template-columns: 380px 1fr 300px; min-height: 100vh; }
        .sidebar { background: var(--bg-secondary); border-right: 1px solid var(--border-color); padding: 16px; overflow-y: auto; }
        .main { padding: 20px; overflow-y: auto; display: flex; flex-direction: column; }
        .debug { background: var(--bg-secondary); border-left: 1px solid var(--border-color); padding: 16px; overflow-y: auto; display: flex; flex-direction: column; }

        .header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }
        .logo { width: 36px; height: 36px; background: linear-gradient(135deg, var(--accent-orange), var(--accent-purple)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .title { font-size: 18px; font-weight: 700; }
        .version-badge { font-size: 9px; padding: 2px 6px; background: linear-gradient(135deg, var(--accent-green), var(--accent-cyan)); border-radius: 4px; color: #fff; font-weight: 700; }
        
        .section { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .section-title { font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; }

        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 14px; border: none; border-radius: 8px; font-family: inherit; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-primary { background: linear-gradient(135deg, var(--accent-green), #16a34a); color: #fff; }
        .btn-secondary { background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); }
        .btn-danger { background: transparent; color: var(--accent-red); border: 1px solid var(--accent-red); }
        .btn-ghost { background: transparent; color: var(--text-secondary); padding: 6px 10px; }
        .btn-warn { background: rgba(234, 179, 8, 0.1); color: var(--accent-yellow); border: 1px solid var(--accent-yellow); }
        .btn-stop { background: var(--accent-red); color: #fff; }
        .btn-cyan { background: var(--accent-cyan); color: #000; }
        .btn-purple { background: var(--accent-purple); color: #fff; }

        .input-group { margin-bottom: 12px; }
        .input-label { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 500; color: var(--text-secondary); margin-bottom: 6px; }
        input, textarea, select { width: 100%; padding: 10px 12px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-family: inherit; font-size: 13px; }
        input:focus, textarea:focus { outline: none; border-color: var(--accent-green); }

        .account-card { background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 10px; padding: 12px; margin-bottom: 8px; cursor: pointer; position: relative; transition: all 0.2s; }
        .account-card.dead { opacity: 0.5; border-color: var(--accent-red); background: rgba(239, 68, 68, 0.05); }
        .account-card.active-worker { border-color: var(--accent-green); box-shadow: 0 0 0 1px var(--accent-green); }
        .account-name { font-size: 12px; font-weight: 600; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center; }
        .account-status { font-size: 9px; padding: 2px 6px; border-radius: 4px; background: var(--bg-primary); }
        .account-detail { font-size: 10px; color: var(--text-muted); margin-top: 4px; }
        .worker-stats { font-size: 9px; color: var(--accent-cyan); margin-top: 4px; }
        .concurrent-badge { font-size: 9px; color: var(--accent-orange); margin-top: 2px; }
        
        .control-row { display: flex; gap: 6px; margin-bottom: 12px; }
        .control-row .btn { flex: 1; padding: 10px 8px; font-size: 11px; }
        
        .option-row { display: flex; gap: 8px; margin-bottom: 12px; }
        .option-group { flex: 1; }
        .option-label { font-size: 10px; color: var(--text-muted); margin-bottom: 4px; }
        .option-btns { display: flex; gap: 4px; }
        .option-btn { flex: 1; padding: 8px 4px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-secondary); font-size: 11px; cursor: pointer; text-align: center; transition: all 0.2s; }
        .option-btn.active { background: var(--accent-cyan); border-color: var(--accent-cyan); color: #000; font-weight: 600; }
        .option-btn.concurrent.active { background: var(--accent-orange); border-color: var(--accent-orange); }
        .option-btn.model.active { background: var(--accent-purple); border-color: var(--accent-purple); color: #fff; }
        
        .stats-bar { display: flex; gap: 15px; margin-bottom: 16px; padding: 12px 18px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; flex-wrap: wrap; align-items: center; }
        .stat { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-secondary); }
        .stat span { font-weight: 700; font-size: 14px; }
        .stat.pending span { color: var(--accent-yellow); }
        .stat.processing span { color: var(--accent-cyan); }
        .stat.done span { color: var(--accent-green); }
        .stat.error span { color: var(--accent-red); }
        .stat.workers span { color: var(--accent-orange); }

        .toolbar { display: flex; gap: 16px; margin-bottom: 16px; align-items: center; flex-wrap: wrap; padding: 12px 16px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; }
        .toolbar-group { display: flex; gap: 6px; align-items: center; }
        .toolbar-label { font-size: 11px; color: var(--text-muted); white-space: nowrap; }
        .toolbar select { padding: 6px 10px; font-size: 11px; min-width: 120px; }

        .task-list { display: flex; flex-direction: column; gap: 10px; }
        .task-row { display: flex; align-items: stretch; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; overflow: hidden; min-height: 80px; }
        .task-row.processing { border-color: var(--accent-cyan); animation: pulse-border 2s infinite; }
        .task-row.done { border-color: var(--accent-green); }
        .task-row.error { border-color: var(--accent-red); }
        @keyframes pulse-border { 0%, 100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4); } 50% { box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1); } }
        
        .task-status-bar { width: 4px; flex-shrink: 0; }
        .task-status-bar.pending { background: var(--accent-yellow); }
        .task-status-bar.processing { background: var(--accent-cyan); }
        .task-status-bar.done { background: var(--accent-green); }
        .task-status-bar.error { background: var(--accent-red); }
        
        .task-content { flex: 1; padding: 12px; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
        .task-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
        .task-badge { padding: 3px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; flex-shrink: 0; }
        .task-badge.pending { background: var(--accent-yellow); color: #000; }
        .task-badge.processing { background: var(--accent-cyan); color: #000; }
        .task-badge.done { background: var(--accent-green); color: #000; }
        .task-badge.error { background: var(--accent-red); color: #fff; }
        .task-prompt { font-size: 12px; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
        .task-meta { font-size: 10px; color: var(--text-muted); display: flex; gap: 10px; align-items: center; }
        .task-worker { display: inline-block; padding: 2px 6px; background: var(--bg-tertiary); border-radius: 4px; color: var(--accent-cyan); }
        .task-error { color: var(--accent-red); font-size: 10px; margin-top: 4px; }
        .task-actions { display: flex; gap: 4px; margin-left: auto; align-items: center; }
        .task-actions .btn { padding: 4px 8px; font-size: 10px; }
        
        .task-images { display: flex; gap: 4px; padding: 8px; background: var(--bg-tertiary); align-items: center; flex-shrink: 0; max-width: 360px; overflow-x: auto; }
        .task-thumb { border-radius: 6px; overflow: hidden; cursor: pointer; flex-shrink: 0; border: 2px solid transparent; transition: all 0.2s; position: relative; }
        .task-thumb:hover { border-color: var(--accent-cyan); transform: scale(1.05); }
        .task-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .task-thumb .thumb-index { position: absolute; bottom: 2px; right: 2px; background: rgba(0,0,0,0.7); color: #fff; font-size: 8px; padding: 1px 4px; border-radius: 3px; }
        
        .thumb-16-9 { width: 80px; height: 45px; }
        .thumb-9-16 { width: 45px; height: 80px; }
        .thumb-1-1 { width: 64px; height: 64px; }
        
        .task-placeholder { border-radius: 6px; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 16px; flex-shrink: 0; }
        .task-placeholder.loading::after { content: ''; width: 16px; height: 16px; border: 2px solid var(--accent-cyan); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .log { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; padding: 8px; font-size: 10px; margin-bottom: 6px; }
        .log.error { border-left: 2px solid var(--accent-red); }
        .log.success { border-left: 2px solid var(--accent-green); }
        .log.info { border-left: 2px solid var(--accent-cyan); }
        .log.warn { border-left: 2px solid var(--accent-yellow); }

        .lightbox { position: fixed; inset: 0; z-index: 2000; background: rgba(0,0,0,0.98); display: none; flex-direction: column; }
        .lightbox.show { display: flex; }
        .lightbox-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: rgba(0,0,0,0.5); border-bottom: 1px solid rgba(255,255,255,0.1); }
        .lightbox-info { flex: 1; min-width: 0; }
        .lightbox-prompt { font-size: 13px; color: var(--text-primary); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lightbox-counter { font-size: 11px; color: var(--text-muted); }
        .lightbox-actions { display: flex; gap: 8px; }
        .lightbox-actions .btn { padding: 8px 12px; }
        .lightbox-body { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 20px; }
        .lightbox-img { max-width: 100%; max-height: 100%; object-fit: contain; cursor: zoom-in; transition: transform 0.3s; }
        .lightbox-img.zoomed { cursor: zoom-out; transform: scale(2); }
        .lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 50px; height: 80px; background: rgba(0,0,0,0.5); border: none; color: #fff; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .lightbox-nav:hover { background: rgba(255,255,255,0.1); }
        .lightbox-nav.prev { left: 0; border-radius: 0 8px 8px 0; }
        .lightbox-nav.next { right: 0; border-radius: 8px 0 0 8px; }
        .lightbox-strip { display: flex; gap: 6px; padding: 12px 20px; background: rgba(0,0,0,0.8); overflow-x: auto; justify-content: center; }
        .lightbox-strip-thumb { width: 60px; height: 60px; border-radius: 6px; overflow: hidden; cursor: pointer; flex-shrink: 0; border: 2px solid transparent; opacity: 0.6; }
        .lightbox-strip-thumb:hover { opacity: 1; }
        .lightbox-strip-thumb.active { border-color: var(--accent-cyan); opacity: 1; }
        .lightbox-strip-thumb img { width: 100%; height: 100%; object-fit: cover; }

        .modal { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; }
        .modal.show { display: flex; }
        .modal-content { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 16px; width: 90%; max-width: 600px; max-height: 90vh; overflow: hidden; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--border-color); }
        .modal-title { font-size: 16px; font-weight: 600; }
        .modal-body { padding: 20px; max-height: 60vh; overflow-y: auto; }
        .modal-footer { padding: 16px 20px; border-top: 1px solid var(--border-color); display: flex; gap: 10px; justify-content: flex-end; }

        .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px; color: var(--text-muted); }
        .debug-title { font-size: 14px; font-weight: 600; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
        .log-list { flex: 1; overflow-y: auto; }
        .log-time { color: var(--text-muted); margin-right: 6px; }
        .log-tag { font-weight: 600; margin-right: 6px; }

        /* Reference Grid - UPDATED */
        .ref-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 10px; }
        .ref-slot { aspect-ratio: 1; background: var(--bg-primary); border: 2px dashed var(--border-color); border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; overflow: hidden; font-size: 18px; color: var(--text-muted); }
        .ref-slot:hover { border-color: var(--accent-cyan); }
        .ref-slot.has-img { border-style: solid; border-color: var(--accent-yellow); }
        .ref-slot.uploaded { border-color: var(--accent-green); }
        .ref-slot img { width: 100%; height: 100%; object-fit: cover; }
        .ref-slot .remove { position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; background: var(--accent-red); border: none; border-radius: 50%; color: #fff; font-size: 10px; cursor: pointer; display: none; }
        .ref-slot:hover .remove { display: block; }
        .ref-slot .upload-badge { position: absolute; bottom: 2px; left: 2px; right: 2px; font-size: 7px; padding: 2px; background: rgba(0,0,0,0.8); color: var(--accent-green); text-align: center; border-radius: 3px; }
        .ref-slot .pending-badge { position: absolute; bottom: 2px; left: 2px; right: 2px; font-size: 7px; padding: 2px; background: rgba(0,0,0,0.8); color: var(--accent-yellow); text-align: center; border-radius: 3px; }

        .info-text { font-size: 10px; color: var(--text-muted); padding: 8px; background: var(--bg-tertiary); border-radius: 6px; margin-top: 8px; line-height: 1.5; }
        .info-text code { background: var(--bg-primary); padding: 1px 4px; border-radius: 3px; font-family: 'JetBrains Mono', monospace; }

        .notification { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 20px 40px; background: linear-gradient(135deg, var(--accent-green), #16a34a); color: #fff; border-radius: 16px; font-weight: 600; font-size: 16px; z-index: 3000; display: none; animation: bounceIn 0.5s ease; box-shadow: 0 8px 32px rgba(34, 197, 94, 0.4); }
        .notification.show { display: block; }
        .notification.error { background: linear-gradient(135deg, var(--accent-red), #dc2626); }
        @keyframes bounceIn { 0% { transform: translateX(-50%) scale(0.5); opacity: 0; } 50% { transform: translateX(-50%) scale(1.1); } 100% { transform: translateX(-50%) scale(1); opacity: 1; } }

        .quick-add { margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--border-color); }
        .quick-add-label { font-size: 10px; color: var(--accent-orange); margin-bottom: 6px; }

        .toggle-switch { position: relative; display: inline-block; width: 40px; height: 20px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-slider { position: absolute; cursor: pointer; inset: 0; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 20px; transition: 0.3s; }
        .toggle-slider::before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background: var(--text-muted); border-radius: 50%; transition: 0.3s; }
        .toggle-switch input:checked + .toggle-slider { background: var(--accent-green); border-color: var(--accent-green); }
        .toggle-switch input:checked + .toggle-slider::before { transform: translateX(20px); background: #fff; }
        .parsed-accounts { margin-top: 10px; max-height: 150px; overflow-y: auto; }
        .parsed-account { padding: 6px 8px; background: var(--bg-tertiary); border-radius: 6px; margin-bottom: 4px; font-size: 10px; }
        .parsed-account .name { color: var(--accent-cyan); font-weight: 600; }
        .parsed-account .info { color: var(--text-muted); }

        /* Proxy URL indicator */
        .proxy-status { display: flex; align-items: center; gap: 6px; font-size: 10px; padding: 6px 10px; background: var(--bg-tertiary); border-radius: 6px; margin-top: 8px; }
        .proxy-status.connected { color: var(--accent-green); }
        .proxy-status.disconnected { color: var(--accent-red); }
        .proxy-dot { width: 8px; height: 8px; border-radius: 50%; }
        .proxy-dot.on { background: var(--accent-green); }
        .proxy-dot.off { background: var(--accent-red); }
    </style>
</head>
<body>
    <div class="app">
        <div class="sidebar">
            <div class="header">
                <div class="logo">🚀</div>
                <div class="title">Flow <span style="color: var(--accent-orange)">Gen</span></div>
                <span class="version-badge">V15</span>
            </div>

            <!-- PROXY URL -->
            <div class="section">
                <div class="section-title" style="margin-bottom: 8px">🌐 Proxy URL</div>
                <input type="text" id="proxy-url" placeholder="https://your-vercel-app.vercel.app" value="">
                <div class="proxy-status disconnected" id="proxy-status">
                    <span class="proxy-dot off"></span>
                    <span>Chưa kết nối</span>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    <div class="section-title">⚡ Workers (<span id="worker-count">0</span>)</div>
                    <button class="btn btn-primary" onclick="openAddWorkerModal()" style="padding: 6px 12px; font-size: 11px">+ Add</button>
                </div>
                <div id="accounts-list"></div>
            </div>

            <div class="section">
                <div class="section-header"><div class="section-title">🔥 Concurrent / Account</div></div>
                <div class="option-btns" id="concurrent-btns">
                    <button class="option-btn concurrent active" data-value="1" onclick="setConcurrent(1)">1</button>
                    <button class="option-btn concurrent" data-value="2" onclick="setConcurrent(2)">2</button>
                    <button class="option-btn concurrent" data-value="3" onclick="setConcurrent(3)">3</button>
                    <button class="option-btn concurrent" data-value="4" onclick="setConcurrent(4)">4</button>
                </div>
            </div>

            <div class="section">
                <div class="section-title" style="margin-bottom: 12px">⚙️ Options</div>
                <div class="option-row">
                    <div class="option-group">
                        <div class="option-label">Model</div>
                        <div class="option-btns" id="model-btns">
                            <button class="option-btn model" data-value="IMAGEN_4" onclick="setModel('IMAGEN_4')">Imagen 4</button>
                            <button class="option-btn model" data-value="GEM_PIX" onclick="setModel('GEM_PIX')">Nano</button>
                            <button class="option-btn model active" data-value="GEM_PIX_2" onclick="setModel('GEM_PIX_2')">Nano Pro</button>
                        </div>
                    </div>
                </div>
                <div class="option-row">
                    <div class="option-group">
                        <div class="option-label">Aspect Ratio</div>
                        <div class="option-btns" id="aspect-btns">
                            <button class="option-btn" data-value="IMAGE_ASPECT_RATIO_LANDSCAPE" onclick="setAspect('IMAGE_ASPECT_RATIO_LANDSCAPE')">16:9</button>
                            <button class="option-btn" data-value="IMAGE_ASPECT_RATIO_PORTRAIT" onclick="setAspect('IMAGE_ASPECT_RATIO_PORTRAIT')">9:16</button>
                            <button class="option-btn active" data-value="IMAGE_ASPECT_RATIO_SQUARE" onclick="setAspect('IMAGE_ASPECT_RATIO_SQUARE')">1:1</button>
                        </div>
                    </div>
                    <div class="option-group">
                        <div class="option-label">Images/Prompt</div>
                        <div class="option-btns" id="count-btns">
                            <button class="option-btn active" data-value="1" onclick="setCount(1)">1</button>
                            <button class="option-btn" data-value="2" onclick="setCount(2)">2</button>
                            <button class="option-btn" data-value="3" onclick="setCount(3)">3</button>
                            <button class="option-btn" data-value="4" onclick="setCount(4)">4</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- REFERENCE IMAGES - UPDATED -->
            <div class="section">
                <div class="section-header">
                    <div class="section-title" id="ref-title">🖼️ Reference (0/8)</div>
                    <button class="btn btn-purple" onclick="uploadAllRefs()" style="padding: 6px 10px; font-size: 10px" id="upload-ref-btn">📤 Upload</button>
                </div>
                <div class="ref-grid" id="ref-grid"></div>
                <div class="info-text" id="ref-info">
                    <span style="color: var(--accent-yellow)">⚠️ Thêm ảnh → Bấm Upload → Generate</span><br>
                    Cần có Proxy URL và Token để upload.
                </div>
            </div>

            <div class="section">
                <div class="section-title" style="margin-bottom: 8px">📝 Prompts</div>
                <textarea id="prompts" rows="5" placeholder="One prompt per line..."></textarea>
                <div class="control-row" style="margin-top: 12px">
                    <button id="gen-btn" class="btn btn-primary" onclick="startGeneration()">▶️ Generate</button>
                    <button id="pause-btn" class="btn btn-secondary" onclick="togglePause()">⏸️ Pause</button>
                    <button class="btn btn-stop" onclick="stopAll()">⏹️ Stop</button>
                </div>
            </div>
        </div>

        <div class="main">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px">
                <h2 style="font-size: 18px; font-weight: 600">📷 Generated Images</h2>
                <div style="display: flex; gap: 8px">
                    <button class="btn btn-danger" onclick="clearAllTasks()">🗑️ Clear</button>
                    <button class="btn btn-primary" onclick="downloadAllImages()">⬇️ Download All</button>
                </div>
            </div>

            <div class="stats-bar">
                <div class="stat workers">Active: <span id="stat-workers">0</span></div>
                <div class="stat pending">Pending: <span id="stat-pending">0</span></div>
                <div class="stat processing">Processing: <span id="stat-processing">0</span></div>
                <div class="stat done">Done: <span id="stat-done">0</span></div>
                <div class="stat error">Errors: <span id="stat-error">0</span></div>
                <div class="stat" id="retry-status" style="display: none; color: var(--accent-yellow)">🔄 Auto-retry: <span>active</span></div>
            </div>

            <div class="toolbar">
                <div class="toolbar-group">
                    <span class="toolbar-label">Sắp xếp:</span>
                    <select id="sort-order" onchange="renderTasks()">
                        <option value="desc">Mới → Cũ</option>
                        <option value="asc">Cũ → Mới</option>
                    </select>
                </div>
                <div class="toolbar-group">
                    <span class="toolbar-label">Auto-retry lỗi:</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="auto-retry-toggle" checked onchange="toggleAutoRetry()">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="toolbar-group">
                    <span class="toolbar-label">Download:</span>
                    <select id="download-index">
                        <option value="all">Tất cả ảnh</option>
                        <option value="0">Tất cả ảnh #1</option>
                        <option value="1">Tất cả ảnh #2</option>
                        <option value="2">Tất cả ảnh #3</option>
                        <option value="3">Tất cả ảnh #4</option>
                    </select>
                    <button class="btn btn-cyan" onclick="downloadByIndex()" style="padding: 6px 12px">⬇️ ZIP</button>
                </div>
            </div>

            <div class="task-list" id="task-list">
                <div class="empty"><div style="font-size: 48px; margin-bottom: 16px">🎨</div><div>No tasks yet</div></div>
            </div>
        </div>

        <div class="debug">
            <div class="debug-title">🔧 Debug <button class="btn btn-ghost" onclick="clearLogs()" style="font-size: 10px">Clear</button></div>
            <div class="log-list" id="log-list"></div>
        </div>
    </div>

    <div class="notification" id="notification">✅ Done!</div>

    <div class="lightbox" id="lightbox">
        <div class="lightbox-header">
            <div class="lightbox-info"><div class="lightbox-prompt" id="lightbox-prompt"></div><div class="lightbox-counter" id="lightbox-counter"></div></div>
            <div class="lightbox-actions">
                <button class="btn btn-secondary" onclick="copyPrompt()">📋</button>
                <button class="btn btn-primary" onclick="downloadCurrentImage()">⬇️</button>
                <button class="btn btn-ghost" onclick="closeLightbox()" style="font-size: 20px">✕</button>
            </div>
        </div>
        <div class="lightbox-body">
            <button class="lightbox-nav prev" onclick="prevImage()">❮</button>
            <img id="lightbox-img" class="lightbox-img" onclick="toggleZoom()">
            <button class="lightbox-nav next" onclick="nextImage()">❯</button>
        </div>
        <div class="lightbox-strip" id="lightbox-strip"></div>
    </div>

    <div class="modal" id="add-worker-modal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">➕ Add Workers</div>
                <button class="btn btn-ghost" onclick="closeModal('add-worker-modal')" style="font-size: 18px">✕</button>
            </div>
            <div class="modal-body">
                <div class="input-group">
                    <div class="input-label">⚡ Quick Add (nhiều dòng) <span style="color: var(--accent-orange)">Khuyên dùng!</span></div>
                    <textarea id="quick-add-input" rows="5" placeholder="Mỗi dòng 1 account:&#10;cookie|token|project_url&#10;&#10;Hoặc không có cookie:&#10;token|project_url"></textarea>
                    <button class="btn btn-warn" onclick="parseQuickAdd()" style="margin-top: 8px; width: 100%">📋 Parse & Preview</button>
                </div>
                
                <div class="parsed-accounts" id="parsed-accounts"></div>

                <div style="border-top: 1px dashed var(--border-color); margin: 16px 0; padding-top: 16px">
                    <div class="input-label" style="color: var(--text-muted)">Hoặc thêm thủ công:</div>
                </div>
                
                <div class="input-group"><div class="input-label">Name</div><input type="text" id="worker-name" placeholder="Worker 1"></div>
                <div class="input-group"><div class="input-label">Project URL / ID</div><input type="text" id="worker-project" placeholder="UUID hoặc full URL"></div>
                <div class="input-group"><div class="input-label">Bearer Token</div><input type="text" id="worker-token" placeholder="ya29.a0..."></div>
                <div class="input-group"><div class="input-label">Cookie (optional)</div><textarea id="worker-cookie" rows="2" placeholder="Paste cookies..."></textarea></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal('add-worker-modal')">Cancel</button>
                <button class="btn btn-cyan" id="add-parsed-btn" onclick="addParsedAccounts()" style="display: none">➕ Add All Parsed</button>
                <button class="btn btn-primary" onclick="addWorker()">Add Single</button>
            </div>
        </div>
    </div>

    <script>
        // ==================== STATE ====================
        let accounts = [], tasks = [], taskIndex = 0, activeWorkers = new Map();
        let isStopped = false, isPaused = false, totalTasks = 0, completedTasks = 0;
        let selectedModel = 'GEM_PIX_2', selectedAspect = 'IMAGE_ASPECT_RATIO_SQUARE', selectedCount = 1, selectedConcurrent = 1;
        let currentLbImages = [], currentLbIndex = 0, isZoomed = false;
        let parsedAccountsList = [];
        let autoRetryEnabled = true;
        let retryLoopRunning = false;
        
        // Reference images - NEW STRUCTURE
        // { base64, mimeType, mediaId, uploaded }
        let refImages = [];
        let proxyUrl = '';

        // ==================== DATABASE ====================
        const db = {
            name: 'FlowGenV15', version: 1, db: null,
            async init() {
                return new Promise((resolve, reject) => {
                    const req = indexedDB.open(this.name, this.version);
                    req.onerror = () => reject(req.error);
                    req.onsuccess = () => { this.db = req.result; resolve(); };
                    req.onupgradeneeded = (e) => { 
                        if (!e.target.result.objectStoreNames.contains('tasks')) 
                            e.target.result.createObjectStore('tasks', { keyPath: 'id' }); 
                    };
                });
            },
            async saveTask(t) { return new Promise((r, j) => { const tx = this.db.transaction('tasks', 'readwrite'); tx.objectStore('tasks').put(t); tx.oncomplete = () => r(); tx.onerror = () => j(tx.error); }); },
            async loadTasks() { return new Promise((r, j) => { const tx = this.db.transaction('tasks', 'readonly'); const req = tx.objectStore('tasks').getAll(); req.onsuccess = () => r(req.result || []); req.onerror = () => j(req.error); }); },
            async deleteTask(id) { return new Promise((r, j) => { const tx = this.db.transaction('tasks', 'readwrite'); tx.objectStore('tasks').delete(id); tx.oncomplete = () => r(); tx.onerror = () => j(tx.error); }); },
            async clearTasks() { return new Promise((r, j) => { const tx = this.db.transaction('tasks', 'readwrite'); tx.objectStore('tasks').clear(); tx.oncomplete = () => r(); tx.onerror = () => j(tx.error); }); }
        };

        // ==================== INIT ====================
        async function init() {
            await db.init();
            accounts = JSON.parse(localStorage.getItem('flow_v15_accounts') || '[]');
            tasks = await db.loadTasks(); 
            tasks.sort((a, b) => b.id - a.id);
            if (tasks.length) taskIndex = Math.max(...tasks.map(t => t.index));
            
            // Load settings
            selectedConcurrent = parseInt(localStorage.getItem('flow_v15_concurrent') || '1');
            selectedModel = localStorage.getItem('flow_v15_model') || 'GEM_PIX_2';
            selectedAspect = localStorage.getItem('flow_v15_aspect') || 'IMAGE_ASPECT_RATIO_SQUARE';
            selectedCount = parseInt(localStorage.getItem('flow_v15_count') || '1');
            proxyUrl = localStorage.getItem('flow_v15_proxy') || '';
            
            document.getElementById('proxy-url').value = proxyUrl;
            updateProxyStatus();
            
            renderAccounts(); 
            renderTasks(); 
            renderRefSlots(); 
            updateQueueStatus(); 
            updateAllButtons();
            log('info', 'System', 'Flow Gen V15 initialized');
        }

        // ==================== PROXY ====================
        function updateProxyStatus() {
            proxyUrl = document.getElementById('proxy-url').value.trim();
            localStorage.setItem('flow_v15_proxy', proxyUrl);
            
            const statusEl = document.getElementById('proxy-status');
            if (proxyUrl) {
                statusEl.className = 'proxy-status connected';
                statusEl.innerHTML = '<span class="proxy-dot on"></span><span>Đã cấu hình: ' + proxyUrl.substring(0, 30) + '...</span>';
            } else {
                statusEl.className = 'proxy-status disconnected';
                statusEl.innerHTML = '<span class="proxy-dot off"></span><span>Chưa cấu hình</span>';
            }
        }
        
        document.getElementById('proxy-url').addEventListener('change', updateProxyStatus);
        document.getElementById('proxy-url').addEventListener('blur', updateProxyStatus);

        // ==================== ACCOUNTS ====================
        function saveAccounts() { localStorage.setItem('flow_v15_accounts', JSON.stringify(accounts)); }

        function setConcurrent(n) { selectedConcurrent = n; localStorage.setItem('flow_v15_concurrent', n); updateButtons('concurrent-btns', n); }
        function setModel(m) { selectedModel = m; localStorage.setItem('flow_v15_model', m); updateButtons('model-btns', m); }
        function setAspect(a) { selectedAspect = a; localStorage.setItem('flow_v15_aspect', a); updateButtons('aspect-btns', a); }
        function setCount(c) { selectedCount = c; localStorage.setItem('flow_v15_count', c); updateButtons('count-btns', c); }
        
        function updateButtons(id, val) { document.getElementById(id)?.querySelectorAll('.option-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.value == val)); }
        function updateAllButtons() { updateButtons('concurrent-btns', selectedConcurrent); updateButtons('model-btns', selectedModel); updateButtons('aspect-btns', selectedAspect); updateButtons('count-btns', selectedCount); }

        function toggleAutoRetry() {
            autoRetryEnabled = document.getElementById('auto-retry-toggle').checked;
            log('info', 'Config', `Auto-retry: ${autoRetryEnabled ? 'ON' : 'OFF'}`);
            if (autoRetryEnabled && !retryLoopRunning) startRetryLoop();
        }

        async function startRetryLoop() {
            if (retryLoopRunning) return;
            retryLoopRunning = true;
            log('info', 'AutoRetry', 'Retry loop started');
            
            while (autoRetryEnabled) {
                await sleep(5000);
                const errorTasks = tasks.filter(t => t.status === 'error');
                if (errorTasks.length === 0) {
                    const active = tasks.filter(t => t.status === 'pending' || t.status === 'processing').length;
                    if (active === 0) break;
                    continue;
                }
                
                const liveWorkers = accounts.filter(a => a.status !== 'dead');
                if (liveWorkers.length === 0) {
                    log('warn', 'AutoRetry', 'No live workers');
                    await sleep(10000);
                    continue;
                }
                
                log('info', 'AutoRetry', `Retrying ${errorTasks.length} tasks...`);
                for (const task of errorTasks) {
                    task.status = 'pending';
                    task.error = null;
                    task.retryCount = 0;
                    await db.saveTask(task);
                }
                
                renderTasks();
                updateQueueStatus();
                
                liveWorkers.forEach(acc => {
                    if (!activeWorkers.has(acc.id)) {
                        activeWorkers.set(acc.id, new Set());
                        for (let s = 0; s < selectedConcurrent; s++) runWorkerSlot(acc, s);
                    }
                });
                
                await sleep(15000);
            }
            
            retryLoopRunning = false;
            log('info', 'AutoRetry', 'Retry loop stopped');
        }

        // ==================== SOUND & NOTIFICATION ====================
        function playCompleteSound() {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);
                osc.start(ctx.currentTime + i * 0.15);
                osc.stop(ctx.currentTime + i * 0.15 + 0.3);
            });
        }

        function showNotification(msg, isError = false) {
            const el = document.getElementById('notification');
            el.textContent = msg;
            el.classList.toggle('error', isError);
            el.classList.add('show');
            if (!isError) playCompleteSound();
            setTimeout(() => el.classList.remove('show'), 5000);
        }

        // ==================== WORKER MANAGEMENT ====================
        function openAddWorkerModal() {
            document.getElementById('worker-name').value = `Worker ${accounts.length + 1}`;
            ['worker-project', 'worker-token', 'worker-cookie', 'quick-add-input'].forEach(id => document.getElementById(id).value = '');
            document.getElementById('parsed-accounts').innerHTML = '';
            document.getElementById('add-parsed-btn').style.display = 'none';
            parsedAccountsList = [];
            document.getElementById('add-worker-modal').classList.add('show');
        }
        
        function closeModal(id) { document.getElementById(id).classList.remove('show'); }
        
        function parseQuickAdd() {
            const input = document.getElementById('quick-add-input').value.trim();
            if (!input) { alert('Chưa nhập!'); return; }
            
            const lines = input.split('\n').filter(l => l.trim());
            parsedAccountsList = [];
            
            lines.forEach((line, idx) => {
                const parts = line.split('|').map(p => p.trim());
                let cookie = '', token = '', projectUrl = '';
                
                if (parts.length >= 3) {
                    cookie = parts[0];
                    token = parts[1];
                    projectUrl = parts[2];
                } else if (parts.length === 2) {
                    token = parts[0];
                    projectUrl = parts[1];
                } else {
                    return;
                }
                
                const match = projectUrl.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
                const projectId = match ? match[1] : null;
                
                if (projectId && token) {
                    parsedAccountsList.push({ name: `Worker ${accounts.length + idx + 1}`, projectId, token, cookie });
                }
            });
            
            const container = document.getElementById('parsed-accounts');
            if (parsedAccountsList.length > 0) {
                container.innerHTML = `<div style="font-size: 11px; color: var(--accent-green); margin-bottom: 8px">✅ Parsed ${parsedAccountsList.length} accounts:</div>` +
                    parsedAccountsList.map((a, i) => `
                        <div class="parsed-account">
                            <span class="name">${a.name}</span>
                            <span class="info">Project: ${a.projectId.substring(0, 8)}... | Token: ${a.token.substring(0, 15)}...</span>
                        </div>
                    `).join('');
                document.getElementById('add-parsed-btn').style.display = 'block';
                log('success', 'Parse', `Found ${parsedAccountsList.length} valid accounts`);
            } else {
                container.innerHTML = '<div style="color: var(--accent-red); font-size: 11px">❌ Không tìm thấy account hợp lệ!</div>';
                document.getElementById('add-parsed-btn').style.display = 'none';
            }
        }
        
        function addParsedAccounts() {
            if (!parsedAccountsList.length) return;
            parsedAccountsList.forEach(a => {
                accounts.push({
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                    name: a.name, projectId: a.projectId, token: a.token, cookie: a.cookie,
                    status: 'live', tasksCompleted: 0
                });
            });
            saveAccounts();
            renderAccounts();
            closeModal('add-worker-modal');
            showNotification(`✅ Added ${parsedAccountsList.length} workers!`);
            log('success', 'Workers', `Added ${parsedAccountsList.length} accounts`);
            parsedAccountsList = [];
        }
        
        function addWorker() {
            const name = document.getElementById('worker-name').value.trim() || `Worker ${accounts.length + 1}`;
            const projectInput = document.getElementById('worker-project').value.trim();
            const token = document.getElementById('worker-token').value.trim();
            const cookie = document.getElementById('worker-cookie').value.trim();
            if (!projectInput || !token) { alert('Project và Token bắt buộc!'); return; }
            const match = projectInput.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
            const projectId = match ? match[1] : projectInput;
            if (!projectId.match(/^[a-f0-9-]{36}$/i)) { alert('Project ID không hợp lệ!'); return; }
            accounts.push({ id: Date.now().toString(), name, projectId, token, cookie, status: 'live', tasksCompleted: 0 });
            saveAccounts(); 
            renderAccounts(); 
            closeModal('add-worker-modal'); 
            log('success', 'Worker', `Added: ${name}`);
        }
        
        function deleteAccount(id) { 
            if (!confirm('Xóa?')) return; 
            accounts = accounts.filter(a => a.id !== id); 
            activeWorkers.delete(id); 
            saveAccounts(); 
            renderAccounts(); 
            updateQueueStatus(); 
        }

        // ==================== REFERENCE IMAGES - NEW ====================
        function renderRefSlots() {
            const grid = document.getElementById('ref-grid');
            let html = '';
            for (let i = 0; i < 8; i++) {
                const ref = refImages[i];
                if (ref) {
                    const statusClass = ref.mediaId ? 'uploaded' : 'has-img';
                    const badge = ref.mediaId 
                        ? `<span class="upload-badge">✓ Uploaded</span>`
                        : `<span class="pending-badge">Chưa upload</span>`;
                    html += `<div class="ref-slot ${statusClass}">
                        <img src="${ref.base64}">
                        <button class="remove" onclick="removeRef(${i})">✕</button>
                        ${badge}
                    </div>`;
                } else {
                    html += `<div class="ref-slot" onclick="addRef(${i})">+</div>`;
                }
            }
            grid.innerHTML = html;
            
            const uploaded = refImages.filter(r => r && r.mediaId).length;
            const total = refImages.filter(r => r).length;
            document.getElementById('ref-title').textContent = `🖼️ Reference (${uploaded}/${total} uploaded)`;
            
            // Update info text
            const infoEl = document.getElementById('ref-info');
            if (total === 0) {
                infoEl.innerHTML = '<span style="color: var(--text-muted)">Chưa có ảnh tham chiếu</span>';
            } else if (uploaded < total) {
                infoEl.innerHTML = `<span style="color: var(--accent-yellow)">⚠️ Còn ${total - uploaded} ảnh chưa upload!</span><br>Bấm "Upload" trước khi Generate.`;
            } else {
                infoEl.innerHTML = `<span style="color: var(--accent-green)">✅ ${uploaded} ảnh đã sẵn sàng!</span>`;
            }
        }
        
        function addRef(index) {
            const inp = document.createElement('input');
            inp.type = 'file';
            inp.accept = 'image/*';
            inp.onchange = e => {
                const f = e.target.files[0];
                if (f) {
                    const r = new FileReader();
                    r.onload = ev => {
                        refImages[index] = {
                            base64: ev.target.result,
                            mimeType: f.type || 'image/jpeg',
                            mediaId: null,
                            uploaded: false
                        };
                        renderRefSlots();
                        log('info', 'Ref', `Added image ${index + 1}: ${f.name}`);
                    };
                    r.readAsDataURL(f);
                }
            };
            inp.click();
        }
        
        function removeRef(index) {
            refImages[index] = null;
            refImages = refImages.filter(Boolean);
            renderRefSlots();
            log('info', 'Ref', `Removed image ${index + 1}`);
        }
        
        // Upload reference images to Google via Proxy
        async function uploadAllRefs() {
            const toUpload = refImages.filter(r => r && !r.mediaId);
            if (toUpload.length === 0) {
                showNotification('Không có ảnh mới cần upload!', true);
                return;
            }
            
            if (!proxyUrl) {
                showNotification('Chưa cấu hình Proxy URL!', true);
                return;
            }
            
            // Get first available token
            const liveAcc = accounts.find(a => a.status !== 'dead' && a.token);
            if (!liveAcc) {
                showNotification('Cần có ít nhất 1 worker với token!', true);
                return;
            }
            
            log('info', 'Upload', `Uploading ${toUpload.length} reference images...`);
            const btn = document.getElementById('upload-ref-btn');
            btn.disabled = true;
            btn.textContent = '⏳ Uploading...';
            
            let success = 0;
            let failed = 0;
            
            for (let i = 0; i < refImages.length; i++) {
                const ref = refImages[i];
                if (!ref || ref.mediaId) continue;
                
                try {
                    log('info', 'Upload', `Uploading image ${i + 1}...`);
                    
                    const base64Data = ref.base64.split(',')[1];
                    const payload = {
                        imageInput: {
                            rawImageBytes: base64Data,
                            mimeType: ref.mimeType || 'image/jpeg',
                            isUserUploaded: true,
                            aspectRatio: selectedAspect
                        },
                        clientContext: {
                            sessionId: `;${Date.now()}`,
                            tool: 'ASSET_MANAGER'
                        }
                    };
                    
                    const res = await fetch(`${proxyUrl}/api/proxy/uploadUserImage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ bearerToken: liveAcc.token, payload })
                    });
                    
                    const data = await res.json();
                    console.log(`Upload ${i + 1} response:`, data);
                    
                    const mediaId = data?.mediaId || data?.raw?.mediaGenerationId?.mediaGenerationId || data?.raw?.name;
                    
                    if (mediaId) {
                        refImages[i].mediaId = mediaId;
                        refImages[i].uploaded = true;
                        success++;
                        log('success', 'Upload', `✅ Image ${i + 1}: ${mediaId.substring(0, 30)}...`);
                    } else {
                        throw new Error(data.error || 'No mediaId returned');
                    }
                } catch (e) {
                    failed++;
                    log('error', 'Upload', `❌ Image ${i + 1}: ${e.message}`);
                }
            }
            
            btn.disabled = false;
            btn.textContent = '📤 Upload';
            renderRefSlots();
            
            if (failed === 0) {
                showNotification(`✅ Upload thành công ${success} ảnh!`);
            } else if (success > 0) {
                showNotification(`⚠️ ${success} thành công, ${failed} thất bại`, true);
            } else {
                showNotification(`❌ Upload thất bại!`, true);
            }
        }

        // ==================== GENERATION ====================
        async function startGeneration() {
            const live = accounts.filter(a => a.status !== 'dead');
            if (!live.length) { alert('Cần worker!'); return; }
            const text = document.getElementById('prompts').value.trim();
            if (!text) { alert('Cần prompt!'); return; }
            
            // Check proxy URL
            if (!proxyUrl) {
                alert('Chưa cấu hình Proxy URL!');
                return;
            }
            
            // Check if refs need upload
            const needUpload = refImages.filter(r => r && !r.mediaId);
            if (needUpload.length > 0) {
                if (!proxyUrl) {
                    alert('Có ảnh tham chiếu chưa upload và chưa có Proxy URL!\nHãy cấu hình Proxy URL và bấm Upload trước.');
                    return;
                }
                if (confirm(`Còn ${needUpload.length} ảnh chưa upload. Upload ngay?`)) {
                    await uploadAllRefs();
                    // Check again after upload
                    const stillNeed = refImages.filter(r => r && !r.mediaId);
                    if (stillNeed.length > 0) {
                        alert('Một số ảnh upload thất bại. Vui lòng thử lại.');
                        return;
                    }
                } else {
                    return;
                }
            }
            
            const prompts = text.split('\n').filter(p => p.trim());
            isStopped = false; isPaused = false; totalTasks = prompts.length; completedTasks = 0;
            document.getElementById('gen-btn').disabled = true;
            
            const uploadedRefs = refImages.filter(r => r && r.mediaId);
            log('info', 'Generate', `${prompts.length} prompts × ${live.length} workers × ${selectedConcurrent} concurrent` + 
                (uploadedRefs.length ? ` + ${uploadedRefs.length} refs` : ''));
            
            const newTasks = prompts.map((p, i) => ({ 
                id: Date.now() + i, 
                index: ++taskIndex, 
                prompt: p.trim(), 
                status: 'pending', 
                images: [], 
                error: null, 
                retryCount: 0, 
                workerName: null, 
                timestamp: new Date().toLocaleTimeString('vi-VN'), 
                model: selectedModel, 
                aspect: selectedAspect, 
                count: selectedCount,
                refMediaIds: uploadedRefs.map(r => r.mediaId) // Store ref IDs with each task
            }));
            
            for (const t of newTasks) { 
                tasks.unshift(t); 
                await db.saveTask(t); 
            }
            
            renderTasks(); 
            updateQueueStatus();
            
            live.forEach(acc => { 
                if (!activeWorkers.has(acc.id)) { 
                    activeWorkers.set(acc.id, new Set()); 
                    for (let s = 0; s < selectedConcurrent; s++) runWorkerSlot(acc, s); 
                } 
            });
            
            document.getElementById('prompts').value = "";
            
            if (autoRetryEnabled && !retryLoopRunning) startRetryLoop();
        }

        async function runWorkerSlot(account, slot) {
            await sleep(slot * 2000);
            log('info', 'Worker', `[${account.name}] Slot ${slot + 1} started`); 
            renderAccounts();
            
            while (!isStopped) {
                if (isPaused) { await sleep(1000); continue; }
                if (account.status === 'dead') break;
                
                const pending = tasks.filter(t => t.status === 'pending').sort((a, b) => a.id - b.id);
                if (!pending.length) {
                    const processing = tasks.filter(t => t.status === 'processing').length;
                    const errors = tasks.filter(t => t.status === 'error').length;
                    if (!processing) {
                        document.getElementById('gen-btn').disabled = false;
                        if (totalTasks > 0 && (completedTasks >= totalTasks || errors === 0)) {
                            const doneCount = tasks.filter(t => t.status === 'done').length;
                            const errorCount = tasks.filter(t => t.status === 'error').length;
                            if (errorCount === 0) {
                                showNotification(`🎉 Hoàn thành! ${doneCount} ảnh`);
                                log('success', 'Queue', `All ${totalTasks} tasks completed! 🎉`);
                                totalTasks = 0;
                            } else if (autoRetryEnabled) {
                                log('info', 'Queue', `${doneCount} done, ${errorCount} errors - auto-retry enabled`);
                                if (!retryLoopRunning) startRetryLoop();
                            } else {
                                showNotification(`⚠️ ${doneCount} done, ${errorCount} lỗi`, true);
                                totalTasks = 0;
                            }
                        }
                    }
                    await sleep(2000);
                    if (!tasks.filter(t => t.status === 'pending').length) break;
                    continue;
                }

                const task = pending[0];
                task.status = 'processing'; 
                task.workerName = account.name; 
                task.startTime = Date.now();
                const wt = activeWorkers.get(account.id) || new Set(); 
                wt.add(task.id); 
                activeWorkers.set(account.id, wt);
                await db.saveTask(task); 
                renderTasks(); 
                updateQueueStatus();

                try {
                    const result = await callApi(account, task);
                    const images = parseResult(result);
                    if (images.length) {
                        task.images = images; 
                        task.status = 'done'; 
                        task.error = null; 
                        task.endTime = Date.now();
                        account.tasksCompleted++; 
                        completedTasks++;
                        log('success', account.name, `#${task.index} done (${images.length} imgs)`);
                    } else throw new Error("No images");
                } catch (e) {
                    const msg = e.message; 
                    log('error', account.name, `#${task.index}: ${msg}`);
                    if (msg.includes('401') || msg.includes('403')) {
                        account.status = 'dead'; 
                        saveAccounts(); 
                        showNotification(`❌ ${account.name} expired!`, true);
                        task.status = 'pending'; 
                        task.workerName = null; 
                        task.error = "Token expired, re-queued"; 
                        break;
                    } else if (msg.includes('429')) {
                        task.retryCount = (task.retryCount || 0) + 1;
                        task.status = 'pending';
                        task.workerName = null;
                        task.error = `Rate limit (${task.retryCount}x)`;
                        log('warn', account.name, `#${task.index}: Rate limit, waiting 30s...`);
                        await sleep(30000 + Math.random() * 10000);
                    } else {
                        task.retryCount = (task.retryCount || 0) + 1;
                        const maxRetries = autoRetryEnabled ? 10 : 3;
                        if (task.retryCount >= maxRetries) { 
                            task.status = 'error'; 
                            task.error = `Failed after ${maxRetries} retries: ${msg}`; 
                            completedTasks++; 
                        } else { 
                            task.status = 'pending'; 
                            task.error = `Retry ${task.retryCount}/${maxRetries}: ${msg}`; 
                            await sleep(5000 + Math.random() * 5000); 
                        }
                    }
                }

                const wts = activeWorkers.get(account.id); 
                if (wts) wts.delete(task.id);
                await db.saveTask(task); 
                renderTasks(); 
                renderAccounts(); 
                updateQueueStatus();
                await sleep(2000 + Math.random() * 2000);
            }
            
            const wts = activeWorkers.get(account.id); 
            if (wts?.size === 0) activeWorkers.delete(account.id);
            log('info', 'Worker', `[${account.name}] Slot ${slot + 1} stopped`); 
            renderAccounts(); 
            updateQueueStatus();
        }

        function togglePause() { 
            isPaused = !isPaused; 
            const btn = document.getElementById('pause-btn'); 
            btn.innerHTML = isPaused ? "▶️ Resume" : "⏸️ Pause"; 
            btn.className = isPaused ? "btn btn-warn" : "btn btn-secondary"; 
        }
        
        function stopAll() { 
            if (!confirm('Dừng?')) return; 
            isStopped = true; 
            isPaused = false; 
            tasks.filter(t => t.status === 'processing').forEach(t => { 
                t.status = 'pending'; 
                t.workerName = null; 
                db.saveTask(t); 
            }); 
            document.getElementById('gen-btn').disabled = false; 
            activeWorkers.clear(); 
            updateQueueStatus(); 
            renderTasks(); 
            renderAccounts(); 
        }
        
        function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

        // ==================== API CALL - VIA PROXY ====================
        async function callApi(acc, task) {
            // Build requests array
            const requests = [];
            
            for (let i = 0; i < (task.count || selectedCount); i++) {
                const req = { 
                    clientContext: { sessionId: `;${Date.now()}`, tool: 'PINHOLE' }, 
                    seed: Math.floor(Math.random() * 900000) + 100000, 
                    imageModelName: task.model || selectedModel, 
                    imageAspectRatio: task.aspect || selectedAspect, 
                    prompt: task.prompt
                };
                
                // USE MEDIA IDS instead of base64!
                if (task.refMediaIds && task.refMediaIds.length > 0) {
                    req.imageInputs = task.refMediaIds.map(mediaId => ({
                        name: mediaId,
                        imageInputType: 'IMAGE_INPUT_TYPE_REFERENCE'
                    }));
                }
                
                requests.push(req);
            }
            
            // Call via PROXY instead of direct to Google
            const controller = new AbortController(); 
            const tid = setTimeout(() => controller.abort(), 120000);
            
            const response = await fetch(`${proxyUrl}/api/proxy/batchGenerateImages`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bearerToken: acc.token,
                    projectId: acc.projectId,
                    payload: { requests }
                }), 
                signal: controller.signal 
            });
            clearTimeout(tid);
            
            const data = await response.json();
            
            if (!response.ok || data.error) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }
            
            return data;
        }

        function parseResult(result) {
            let items = Array.isArray(result) ? result : result?.media || result?.responses || result?.generatedImages || [];
            return items.map(item => 
                item?.image?.generatedImage?.fileUrl || 
                item?.image?.generatedImage?.url || 
                item?.image?.fileUrl || 
                item?.fileUrl || 
                item?.url || 
                (item?.image?.generatedImage?.encodedImage ? 'data:image/png;base64,' + item.image.generatedImage.encodedImage : null)
            ).filter(Boolean);
        }

        // ==================== UI UPDATES ====================
        function updateQueueStatus() {
            const counts = { pending: 0, processing: 0, done: 0, error: 0 }; 
            tasks.forEach(t => counts[t.status]++);
            ['pending', 'processing', 'done', 'error'].forEach(s => document.getElementById(`stat-${s}`).textContent = counts[s]);
            let active = 0; 
            activeWorkers.forEach(set => active += set.size || 1); 
            document.getElementById('stat-workers').textContent = active;
            
            const retryEl = document.getElementById('retry-status');
            if (retryLoopRunning && counts.error > 0) {
                retryEl.style.display = 'flex';
                retryEl.querySelector('span').textContent = `retrying ${counts.error}...`;
            } else if (autoRetryEnabled && counts.error > 0) {
                retryEl.style.display = 'flex';
                retryEl.querySelector('span').textContent = 'waiting...';
            } else {
                retryEl.style.display = 'none';
            }
        }

        function getThumbClass(aspect) {
            if (aspect?.includes('LANDSCAPE')) return 'thumb-16-9';
            if (aspect?.includes('PORTRAIT')) return 'thumb-9-16';
            return 'thumb-1-1';
        }

        function renderTasks() {
            const el = document.getElementById('task-list');
            if (!tasks.length) { 
                el.innerHTML = '<div class="empty"><div style="font-size:48px;margin-bottom:16px">🎨</div><div>No tasks</div></div>'; 
                return; 
            }
            
            const sortOrder = document.getElementById('sort-order').value;
            const sorted = [...tasks].sort((a, b) => sortOrder === 'asc' ? a.id - b.id : b.id - a.id);
            
            el.innerHTML = sorted.map(t => {
                const thumbClass = getThumbClass(t.aspect);
                let thumbs = '';
                if (t.status === 'done' && t.images.length) {
                    thumbs = t.images.map((img, i) => `<div class="task-thumb ${thumbClass}" onclick="openLightbox(${t.id},${i})"><img src="${img}" loading="lazy"><span class="thumb-index">${i + 1}</span></div>`).join('');
                } else if (t.status === 'processing') {
                    thumbs = Array(t.count || selectedCount).fill(`<div class="task-placeholder ${thumbClass} loading"></div>`).join('');
                } else if (t.status === 'pending') {
                    thumbs = Array(t.count || selectedCount).fill(`<div class="task-placeholder ${thumbClass}">⏳</div>`).join('');
                } else if (t.status === 'error') {
                    thumbs = `<div class="task-placeholder ${thumbClass}" style="color:var(--accent-red)">❌</div>`;
                }
                
                const refBadge = t.refMediaIds?.length ? `<span style="color:var(--accent-purple);font-size:9px">+${t.refMediaIds.length} refs</span>` : '';
                
                return `<div class="task-row ${t.status}">
                    <div class="task-status-bar ${t.status}"></div>
                    <div class="task-content">
                        <div class="task-header">
                            <span class="task-badge ${t.status}">${t.status}</span>
                            <span class="task-prompt" title="${t.prompt}">${t.prompt}</span>
                            <div class="task-actions">
                                ${t.status === 'done' ? `<button class="btn btn-cyan" onclick="regenerateTask(${t.id})" title="Tạo lại">🔄</button>` : ''}
                                ${t.status === 'error' ? `<button class="btn btn-warn" onclick="retryTask(${t.id})">🔄</button>` : ''}
                                <button class="btn btn-ghost" onclick="deleteTask(${t.id})" style="color:var(--accent-red)">🗑️</button>
                            </div>
                        </div>
                        <div class="task-meta">
                            <span class="task-worker">${t.workerName || '...'}</span>
                            <span>#${t.index} • ${t.timestamp}</span>
                            ${refBadge}
                            ${t.images.length ? `<span style="color:var(--accent-green)">${t.images.length} img</span>` : ''}
                        </div>
                        ${t.error ? `<div class="task-error">⚠️ ${t.error}</div>` : ''}
                    </div>
                    <div class="task-images">${thumbs}</div>
                </div>`;
            }).join('');
        }

        function renderAccounts() {
            const el = document.getElementById('accounts-list'); 
            document.getElementById('worker-count').textContent = accounts.length;
            if (!accounts.length) { 
                el.innerHTML = '<div style="color:var(--text-muted);font-size:11px;text-align:center;padding:20px">No workers</div>'; 
                return; 
            }
            el.innerHTML = accounts.map(a => {
                const wt = activeWorkers.get(a.id); 
                const active = wt ? wt.size : 0; 
                const isActive = active > 0;
                return `<div class="account-card ${a.status === 'dead' ? 'dead' : ''} ${isActive ? 'active-worker' : ''}">
                    <div class="account-name">
                        <span>${isActive ? '⚡ ' : ''}${a.name}</span>
                        <span class="account-status">${a.status === 'dead' ? '💀' : '✅'}</span>
                    </div>
                    <div class="account-detail">Project: ${a.projectId?.substring(0, 18)}...</div>
                    ${a.tasksCompleted ? `<div class="worker-stats">Done: ${a.tasksCompleted}</div>` : ''}
                    ${isActive ? `<div class="concurrent-badge">🔥 ${active} slot(s)</div>` : ''}
                    <button class="btn btn-ghost" onclick="deleteAccount('${a.id}')" style="position:absolute;top:8px;right:8px;padding:2px;color:var(--accent-red);font-size:14px">✕</button>
                </div>`;
            }).join('');
        }

        // ==================== TASK ACTIONS ====================
        async function regenerateTask(id) {
            const task = tasks.find(t => t.id === id);
            if (!task) return;
            
            const uploadedRefs = refImages.filter(r => r && r.mediaId);
            const newTask = {
                id: Date.now(),
                index: ++taskIndex,
                prompt: task.prompt,
                status: 'pending',
                images: [],
                error: null,
                retryCount: 0,
                workerName: null,
                timestamp: new Date().toLocaleTimeString('vi-VN'),
                model: selectedModel,
                aspect: selectedAspect,
                count: selectedCount,
                refMediaIds: uploadedRefs.map(r => r.mediaId)
            };
            
            tasks.unshift(newTask);
            await db.saveTask(newTask);
            renderTasks();
            updateQueueStatus();
            
            const live = accounts.filter(a => a.status !== 'dead');
            live.forEach(acc => {
                if (!activeWorkers.has(acc.id)) {
                    activeWorkers.set(acc.id, new Set());
                    for (let s = 0; s < selectedConcurrent; s++) runWorkerSlot(acc, s);
                }
            });
            
            log('info', 'Regenerate', `Created new task for: ${task.prompt.substring(0, 30)}...`);
        }

        async function retryTask(id) { 
            const t = tasks.find(x => x.id === id); 
            if (t) { 
                t.status = 'pending'; 
                t.error = null; 
                t.retryCount = 0; 
                await db.saveTask(t); 
                renderTasks(); 
                updateQueueStatus(); 
                accounts.filter(a => a.status !== 'dead').forEach(acc => { 
                    if (!activeWorkers.has(acc.id)) { 
                        activeWorkers.set(acc.id, new Set()); 
                        for (let s = 0; s < selectedConcurrent; s++) runWorkerSlot(acc, s); 
                    } 
                }); 
            } 
        }
        
        async function deleteTask(id) { 
            tasks = tasks.filter(t => t.id !== id); 
            await db.deleteTask(id); 
            renderTasks(); 
            updateQueueStatus(); 
        }
        
        async function clearAllTasks() { 
            if (!confirm('Xóa hết?')) return; 
            tasks = []; 
            taskIndex = 0; 
            await db.clearTasks(); 
            renderTasks(); 
            updateQueueStatus(); 
        }

        // ==================== DOWNLOAD ====================
        async function downloadByIndex() {
            const indexSelect = document.getElementById('download-index').value;
            const doneTasks = tasks.filter(t => t.status === 'done' && t.images.length);
            
            if (!doneTasks.length) { alert('Chưa có ảnh!'); return; }
            
            const imgs = [];
            doneTasks.forEach(t => {
                if (indexSelect === 'all') {
                    t.images.forEach((img, i) => imgs.push({ url: img, name: `prompt${t.index}_img${i + 1}.png` }));
                } else {
                    const idx = parseInt(indexSelect);
                    if (t.images[idx]) {
                        imgs.push({ url: t.images[idx], name: `prompt${t.index}_img${idx + 1}.png` });
                    }
                }
            });
            
            if (!imgs.length) { alert('Không có ảnh ở vị trí này!'); return; }
            
            const label = indexSelect === 'all' ? 'all' : `img${parseInt(indexSelect) + 1}_only`;
            log('info', 'Download', `Downloading ${imgs.length} images (${label})...`);
            
            const zip = new JSZip();
            let downloaded = 0;
            for (const img of imgs) {
                try { 
                    zip.file(img.name, await (await fetch(img.url)).blob()); 
                    downloaded++;
                    if (downloaded % 10 === 0) log('info', 'Download', `Progress: ${downloaded}/${imgs.length}`);
                } catch(e) { log('warn', 'Download', `Skip: ${img.name}`); }
            }
            
            const filename = `flow_${label}_${doneTasks.length}prompts_${Date.now()}.zip`;
            saveAs(await zip.generateAsync({ type: 'blob' }), filename);
            log('success', 'Download', `Done! ${downloaded} images saved to ${filename}`);
            showNotification(`✅ Downloaded ${downloaded} images!`);
        }

        // ==================== LIGHTBOX ====================
        function openLightbox(taskId, idx) {
            const task = tasks.find(t => t.id === taskId); 
            if (!task?.images.length) return;
            currentLbImages = []; 
            let start = 0;
            tasks.filter(t => t.status === 'done' && t.images.length).forEach(t => t.images.forEach((img, i) => { 
                currentLbImages.push({ url: img, prompt: t.prompt, index: t.index, imgIndex: i + 1 }); 
                if (t.id === taskId && i === idx) start = currentLbImages.length - 1; 
            }));
            currentLbIndex = start; 
            isZoomed = false; 
            updateLightbox(); 
            document.getElementById('lightbox').classList.add('show');
        }
        
        function updateLightbox() { 
            if (!currentLbImages.length) return; 
            const item = currentLbImages[currentLbIndex]; 
            document.getElementById('lightbox-img').src = item.url; 
            document.getElementById('lightbox-img').classList.remove('zoomed'); 
            isZoomed = false; 
            document.getElementById('lightbox-prompt').textContent = item.prompt; 
            document.getElementById('lightbox-counter').textContent = `#${item.index} (ảnh ${item.imgIndex}) • ${currentLbIndex + 1}/${currentLbImages.length}`; 
            document.getElementById('lightbox-strip').innerHTML = currentLbImages.map((img, i) => `<div class="lightbox-strip-thumb ${i === currentLbIndex ? 'active' : ''}" onclick="jumpToImage(${i})"><img src="${img.url}" loading="lazy"></div>`).join(''); 
        }
        
        function jumpToImage(i) { currentLbIndex = i; updateLightbox(); }
        function nextImage() { if (currentLbIndex < currentLbImages.length - 1) { currentLbIndex++; updateLightbox(); } }
        function prevImage() { if (currentLbIndex > 0) { currentLbIndex--; updateLightbox(); } }
        function toggleZoom() { isZoomed = !isZoomed; document.getElementById('lightbox-img').classList.toggle('zoomed', isZoomed); }
        function closeLightbox() { document.getElementById('lightbox').classList.remove('show'); }
        function copyPrompt() { if (currentLbImages.length) navigator.clipboard.writeText(currentLbImages[currentLbIndex].prompt).then(() => log('success', 'Copy', 'OK')); }
        
        async function downloadCurrentImage() { 
            if (!currentLbImages.length) return; 
            const item = currentLbImages[currentLbIndex]; 
            try { 
                saveAs(await (await fetch(item.url)).blob(), `flow_${item.index}_${item.imgIndex}_${Date.now()}.png`); 
            } catch(e) { 
                log('error', 'DL', e.message); 
            } 
        }
        
        async function downloadAllImages() { 
            const imgs = []; 
            tasks.filter(t => t.status === 'done' && t.images.length).forEach(t => t.images.forEach((img, i) => imgs.push({ url: img, name: `prompt${t.index}_img${i + 1}.png` }))); 
            if (!imgs.length) { alert('No images'); return; } 
            log('info', 'Download', `Zipping ${imgs.length} images...`); 
            const zip = new JSZip(); 
            let downloaded = 0;
            for (const img of imgs) { 
                try { 
                    zip.file(img.name, await (await fetch(img.url)).blob()); 
                    downloaded++;
                    if (downloaded % 10 === 0) log('info', 'Download', `Progress: ${downloaded}/${imgs.length}`);
                } catch(e) {} 
            } 
            saveAs(await zip.generateAsync({ type: 'blob' }), `flow_all_${downloaded}imgs_${Date.now()}.zip`); 
            log('success', 'Download', `Done! ${downloaded} images`);
            showNotification(`✅ Downloaded ${downloaded} images!`);
        }

        // ==================== LOGGING ====================
        function log(type, tag, msg) { 
            const el = document.getElementById('log-list'); 
            const div = document.createElement('div'); 
            div.className = `log ${type}`; 
            div.innerHTML = `<span class="log-time">${new Date().toLocaleTimeString('vi-VN')}</span><span class="log-tag">[${tag}]</span>${msg}`; 
            el.insertBefore(div, el.firstChild); 
            while (el.children.length > 100) el.removeChild(el.lastChild); 
        }
        
        function clearLogs() { document.getElementById('log-list').innerHTML = ''; }

        // ==================== KEYBOARD ====================
        document.addEventListener('keydown', e => { 
            if (!document.getElementById('lightbox').classList.contains('show')) return; 
            if (e.key === 'Escape') closeLightbox(); 
            else if (e.key === 'ArrowRight') nextImage(); 
            else if (e.key === 'ArrowLeft') prevImage(); 
            else if (e.key === ' ') { e.preventDefault(); toggleZoom(); } 
        });

        // ==================== START ====================
        init();
    </script>
</body>
</html>
