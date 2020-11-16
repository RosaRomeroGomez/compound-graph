"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("lodash"),t=require("d3");function s(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var a=s(e);var o={createChart:(e,t,s,a={})=>{e.attr("width",t+"px"),e.attr("height",s+"px");const o=a.x1||0,n=a.y1||0,l=a.x2||t,r=a.y2||s;return e.attr("preserveAspectRatio","xMinYMin meet"),e.attr("viewBox",`${o} ${n} ${l} ${r}`),e.append("defs"),e},translate:(e,t)=>`translate(${e}, ${t})`,line:(e,t,s,a)=>"M"+e+","+t+"L"+s+","+a,pathFn:t.line().x((e=>e.x)).y((e=>e.y)),MARKER_VIEWBOX:"-5 -5 10 10",ARROW:"M 0,-3.25 L 5 ,0 L 0,3.25",ARROW_SHARP:"M 0,-3 L 5 ,0 L 0,3 L 1 0"};const n=["backgroundClick","backgroundDblClick","backgroundMouseEnter","backgroundMouseLeave","backgroundCtx","nodeClick","nodeDblClick","nodeMouseEnter","nodeMouseLeave","nodeCtx","nodeSave","edgeClick","edgeMouseEnter","edgeMouseLeave","edgeCtx"];const l=(e,t,s=0)=>{if(t(e,s),e.nodes){const a=s+1;for(let s=0;s<e.nodes.length;s++)l(e.nodes[s],t,a)}},r=e=>{let t=[],s=[];return l(e,((e,a)=>{a>0&&(t=t.concat(e)),e.edges&&(s=s.concat(e.edges))})),{nodes:t,edges:s}},i=o.pathFn.curve(t.curveBasis),d=(e,t)=>({x1:e.x1,y1:e.y1,x2:Math.max(e.x2,t.width),y2:Math.max(e.y2,t.height)});exports.SVGRenderer=class extends class{constructor(){this.data={},this.registry={}}setData(e){this.data=e}setCallback(e,t){if(-1===n.indexOf(e))throw new Error("Failed to register callback, unknown name "+e);this.registry[e]=t}unsetCallback(e){delete this.registry[e]}initialize(e){throw new Error("Needs impl")}render(){throw new Error("Needs impl")}}{constructor(e){if(super(),this.options=e||{},this.options.renderMode=this.options.renderMode||"basic",this.options.useEdgeControl=this.options.useEdgeControl||!1,this.options.edgeControlOffsetType=this.options.edgeControlOffsetType||"percentage",this.options.edgeControlOffset=this.options.edgeControlOffset||.66,this.options.useDebugger=this.options.useDebugger||!1,this.adapter=this.options.adapter,this.parentEl=null,this.svgEl=null,this.chart=null,this.chartSize={width:1,height:1},this.layout=null,!e.el)throw new Error("options must provide an element for graph rendering");this.initialize(e.el),this.zoom=null,this.collapseTracker={},this.hiddenEdges={}}initialize(e){this.parentEl=e,this.chartSize.width=this.parentEl.clientWidth,this.chartSize.height=this.parentEl.clientHeight,this.svgEl=document.createElementNS("http://www.w3.org/2000/svg","svg"),(e=>{for(;e.firstChild;)e.removeChild(e.firstChild);return e})(this.parentEl).appendChild(this.svgEl),this.svgEl.style.userSelect="none"}setData(e){super.setData(e),this.layout=null}async render(){const e=this.options;if(this.layout||(this.layout=await this.runLayout()),this.chart){const e=0,s=0,a=this.layout.width,o=this.layout.height,n=d({x1:e,y1:s,x2:a,y2:o},this.chartSize);t.select(this.svgEl).attr("viewBox",`${n.x1} ${n.y1} ${n.x2} ${n.y2}`);t.select(this.svgEl).transition().call(this.zoom.transform,t.zoomIdentity);const l=Math.max(2,Math.floor(this.layout.width/this.chartSize.width));this.zoom.scaleExtent([.5,l])}else this.chart=this._createChart();this.buildDefs(),"basic"===e.renderMode?(this.renderNodes(),this.renderEdges()):(this.renderNodesDelta(),this.renderEdgesDelta()),e.useEdgeControl&&this.renderEdgeControls(),this._enableDrag(),e.useDebugger&&this.renderDebug(),this._enableInteraction()}buildDefs(){const e=t.select(this.svgEl),s=r(this.layout).edges;e.select("defs").selectAll(".edge-marker-end").remove(),e.select("defs").selectAll(".edge-marker-end").data(s).enter().append("marker").classed("edge-marker-end",!0).attr("id",(e=>`arrowhead-${e.data.source.replace(/\s/g,"")}-${e.data.target.replace(/\s/g,"")}`)).attr("viewBox",o.MARKER_VIEWBOX).attr("refX",2).attr("refY",0).attr("orient","auto").attr("markerWidth",15).attr("markerHeight",15).attr("markerUnits","userSpaceOnUse").attr("xoverflow","visible").append("svg:path").attr("d",o.ARROW).style("fill","#000").style("stroke","none")}renderEdgesDelta(){const e=this.chart;let s=[];l(this.layout,(e=>{e.edges&&e.edges.length>0&&(s=s.concat(e.edges))}));const a=e.selectAll(".edge").data(s,(e=>e.id)),o=a.enter().append("g").classed("edge",!0);a.exit().each((e=>e.state="removed")),o.each((e=>e.state="new")),a.each((e=>e.state="updated")),e.selectAll(".edge").filter((e=>"updated"===e.state)).each((function(e){t.select(this).selectAll(".edge-path").datum(e)})),e.selectAll(".edge").filter((e=>"new"===e.state)).call(this.renderEdgeAdded),e.selectAll(".edge").filter((e=>"updated"===e.state)).call(this.renderEdgeUpdated),e.selectAll(".edge").filter((e=>"removed"===e.state)).call(this.renderEdgeRemoved)}renderEdges(){const e=this.chart;e.selectAll(".edge").remove();const t=s=>{s.nodes&&s.nodes.forEach((e=>{t(e)})),s.edges&&e.selectAll(".edge").data(s.edges,(e=>e.id)).enter().append("g").classed("edge",!0)};t(this.layout),e.selectAll(".edge").call(this.renderEdge)}renderNodesDelta(){const e=this.chart,s=(e,a)=>{if(!a)return;const n=e.selectAll(".node").filter((function(){return this.parentNode===e.node()})).data(a,(e=>e.id)),l=n.enter().append("g").classed("node",!0);n.exit().each((e=>e.state="removed")),l.each((e=>e.state="new")),n.each((e=>e.state="updated")),[l,n].forEach((e=>{e.each((function(e){const a=t.select(this);0===a.select(".node-ui").size()&&a.append("g").classed("node-ui",!0),a.select(".node-ui").datum(e),0===a.select(".node-children").size()&&a.append("g").classed("node-children",!0),s(a.select(".node-children"),e.nodes)})),e.transition().duration(1e3).attr("transform",(e=>o.translate(e.x,e.y)))}))};s(e,this.layout.nodes),e.selectAll(".node-ui").filter((e=>"new"===e.state)).call(this.renderNodeAdded),e.selectAll(".node-ui").filter((e=>"updated"===e.state)).call(this.renderNodeUpdated),e.selectAll(".node-ui").filter((e=>"removed"===e.state)).call(this.renderNodeRemoved)}renderNodes(){const e=this.chart;e.selectAll(".node").remove();const s=(e,a)=>{if(!a)return;e.selectAll(".node").data(a).enter().append("g").classed("node",!0).attr("transform",(e=>o.translate(e.x,e.y))).each((function(e){const a=t.select(this);a.append("g").classed("node-ui",!0),s(a.append("g"),e.nodes)}))};s(e,this.layout.nodes),e.selectAll(".node-ui").call(this.renderNode)}calculateEdgeControlPlacement(e){const t=this.options;let s=0;const a=e.getTotalLength(),o=t.edgeControlOffset;s="percentage"===t.edgeControlOffsetType?o*a:o>0?o:Math.max(0,a+o);return e.getPointAtLength(s)}renderEdgeControls(){const e=this.chart,s=e.selectAll(".edge");s.selectAll(".edge-control").remove();const a=this;s.each((function(){const e=t.select(this).select("path").node(),s=a.calculateEdgeControlPlacement(e);t.select(this).append("g").classed("edge-control",!0).attr("transform",o.translate(s.x,s.y))})),e.selectAll(".edge-control").call(this.renderEdgeControl)}renderDebug(){const e=this.chart,s=this.options,a=this.chartSize,n=t.select(this.svgEl).select(".background-layer"),l=.5*(this.layout.width<a.width?a.width:this.layout.width),r=.5*(this.layout.height<a.height?a.height:this.layout.height),i=[[-5e3,r,5e3,r],[l,-5e3,l,5e3]];n.selectAll(".info").remove();const d=n.append("g").classed("info",!0),c=t.zoomTransform(e.node());d.append("text").text("TS: "+c.k.toFixed(2)),d.append("text").text("TX: "+c.x.toFixed(2)),d.append("text").text("TY: "+c.y.toFixed(2)),d.append("text").text("Mode: "+s.renderMode),d.selectAll("text").attr("x",3).attr("y",((e,t)=>14*(t+1))).style("font-size","10px"),n.selectAll(".grid").remove(),n.selectAll(".grid").data(i).enter().append("path").classed("grid",!0).attr("d",(e=>o.line(...e))).style("fill","none").style("stroke","#00F").style("stroke-width",1.5).style("opacity",.5)}async runLayout(){const e=this.adapter.makeRenderingGraph(this.data);return this.adapter.run(e)}highlight({nodes:e,edges:s},o){const n=t.select(this.svgEl),l=this.chart,r=o.color||"red",i=o.duration||2e3,d="glow"+(new Date).getTime(),c=n.select("defs").append("filter").attr("id",d).attr("width","200%").attr("filterUnits","userSpaceOnUse");c.append("feGaussianBlur").attr("stdDeviation",4.5).attr("result","blur"),c.append("feOffset").attr("in","blur").attr("result","offsetBlur").attr("dx",0).attr("dy",0).attr("x",-10).attr("y",-10),c.append("feFlood").attr("in","offsetBlur").attr("flood-color",r).attr("flood-opacity",.95).attr("result","offsetColor"),c.append("feComposite").attr("in","offsetColor").attr("in2","offsetBlur").attr("operator","in").attr("result","offsetBlur");const h=c.append("feMerge");h.append("feMergeNode").attr("in","offsetBlur"),h.append("feMergeNode").attr("in","SourceGraphic");const u=l.selectAll(".node").filter((t=>e.includes(t.id)));u.style("filter",`url(#${d})`).classed(""+d,!0);const g=l.selectAll(".edge").filter((e=>a.default.some(s,(t=>t.source===e.data.source&&t.target===e.data.target))));return g.style("filter",`url(#${d})`).classed(""+d,!0),n.select("#"+d).select("feGaussianBlur").transition().duration(i).attr("stdDeviation",0).on("end",(()=>{u.style("filter",null),g.style("filter",null)})),d}unHighlight(e){const s=t.select(this.svgEl);s.select("#"+e).remove(),s.selectAll("."+e).style("filter",null)}moveTo(e,s){const o=this.chart,n=this.chartSize,l=t.select(this.svgEl),i=this.layout.width<n.width?n.width:this.layout.width,d=this.layout.height<n.height?n.height:this.layout.height,c=t.zoomTransform(o.node()),h=r(this.layout).nodes.find((t=>t.id===e));if(a.default.isNil(h))return;let u=h.x,g=h.y,p=h;for(;p.parent&&0!==p.parent.depth;)p=p.parent,u+=p.x,g+=p.y,console.log(u,g);const f=u+.5*h.width,y=g+.5*h.height;l.transition().duration(s).call(this.zoom.transform,t.zoomIdentity.translate(0,0).scale(c.k).translate(-f+.5*i/c.k,-y+.5*d/c.k))}async collapse(e){const t=this.chart.selectAll(".node").filter((t=>t.id===e)).selectAll(".node").data().map((e=>e.id)),s=this.collapseTracker,o=this.hiddenEdges;s[e]={},s[e].edgeMap={},0!==t.length&&(l(this.layout,(n=>{if(n.id===e&&(n.width=40,n.height=40,s[e].nodes=n.nodes,n.nodes=[],n.collapsed=!0),!n.edges)return;const l=a.default.remove(n.edges,(e=>t.includes(e.source)&&t.includes(e.target)));a.default.isEmpty(l)||(o[n.id]=l);for(let o=0;o<n.edges.length;o++){const l=n.edges[o],r=l.source,i=l.target,d={};t.includes(r)&&(d.source=l.source,l.source=e),t.includes(i)&&(d.target=l.target,l.target=e),a.default.isEmpty(d)||(s[e].edgeMap[l.id]=d)}})),this.layout=await this.adapter.run(this.layout),this.render())}async expand(e){const t=this.chart.selectAll(".node").filter((t=>t.id===e)),s=this.collapseTracker,a=this.hiddenEdges,o=s[e];t.datum().nodes=o.nodes,t.datum().collapsed=!1,l(t.datum(),(e=>{({}).hasOwnProperty.call(a,e.id)&&!1===e.collapsed&&(e.edges=e.edges.concat(a[e.id]),delete a[e.id])})),l(this.layout,(e=>{if(e.edges)for(let t=0;t<e.edges.length;t++){const s=e.edges[t];o.edgeMap[s.id]&&(s.target=o.edgeMap[s.id].target||s.target,s.source=o.edgeMap[s.id].source||s.source)}})),delete s[e],this.layout=await this.adapter.run(this.layout),this.render()}async focus(e){const t=this.chart.selectAll(".node").filter((e=>!0===e.focused));if(1===t.size()){const e=t.datum();delete e.width,delete e.height,delete e.focused}const s=this.chart.selectAll(".node").filter((t=>t.id===e));s.nodes&&s.nodes.length>0||(s.datum().width=400,s.datum().height=300,s.datum().focused=!0,this.layout=await this.adapter.run(this.layout),this.render())}async unfocus(e){const t=this.chart.selectAll(".node").filter((t=>t.id===e)).datum();delete t.width,delete t.height,delete t.focused,this.layout=await this.adapter.run(this.layout),this.render()}async group(e,t){const s=this.chart.selectAll(".node").filter((e=>t.includes(e.id))).data();if(1!==a.default.uniq(s.map((e=>e.parent.id))).length)return void console.log("Cannot group across different levels");const o={id:e,label:e,concept:e,depth:s[0].depth,type:"custom",parent:s[0].parent,nodes:[],data:{label:e}},n=s[0].parent;t.forEach((e=>{const t={...a.default.remove(n.nodes,(t=>t.id===e))[0]};t.parent=o,o.nodes.push(t)})),n.nodes.push(o),this.layout=await this.adapter.run(this.layout),this.render()}async ungroup(e){const t=this.chart.selectAll(".node").filter((t=>t.id===e)).data()[0],s=t.parent;a.default.remove(s.nodes,(t=>t.id===e)),t.nodes.forEach((e=>{const t={...e};t.parent=s,s.nodes.push(t)})),delete t.nodes,this.layout=await this.adapter.run(this.layout),this.render()}boundary(){const e=this.chart,s=t.zoomTransform(e.node());return{x1:(0-s.x)/s.k,y1:(0-s.y)/s.k,x2:(this.layout.width-s.x)/s.k,y2:(this.layout.height-s.y)/s.k}}cullEdges(){const{x1:e,y1:s,x2:o,y2:n}=this.boundary();this.chart.selectAll(".edge").each((function(l){const r=a.default.first(l.points),i=a.default.last(l.points);(r.x<e||r.x>o||r.y<s||r.y>n)&&(i.x<e||i.x>o||i.y<s||i.y>n)&&t.select(this).style("opacity",0)}))}uncullEdges(){t.selectAll(".edge").style("opacity",1)}_createChart(){const{width:e,height:s}=this.chartSize,a={x1:0,y1:0,x2:this.layout.width,y2:this.layout.height},n=t.select(this.svgEl);n.selectAll("*").remove();const l=o.createChart(n,e,s,d(a,this.chartSize));l.attr("preserveAspectRatio","xMidYMid meet"),l.append("g").classed("background-layer",!0);const r=l.append("g").classed("data-layer",!0);l.append("g").classed("foreground-layer",!0);const i=this;const c=Math.max(2,Math.floor(this.layout.width/this.chartSize.width));return this.zoom=t.zoom().scaleExtent([.5,c]).on("zoom",(function(){r.attr("transform",t.event.transform),i.options.useDebugger&&i.renderDebug()})),n.call(this.zoom).on("dblclick.zoom",null),r}_enableInteraction(){const e=this.chart,s=this,a=this.registry,o=t.select(this.svgEl),n=e.selectAll(".node"),l=e.selectAll(".edge");s.clickTimer=null;const r=e=>({}.hasOwnProperty.call(a,e));o.on("click",(function(){t.event.stopPropagation();const e=t.zoomTransform(o.node()).invert(t.mouse(this));r("backgroundClick")&&a.backgroundClick(t.select(this),s,{x:e[0],y:e[1]})})),o.on("dblclick",(function(){t.event.stopPropagation();const e=t.zoomTransform(o.node()).invert(t.mouse(this));r("backgroundDblClick")&&a.backgroundDblClick(t.select(this),s,{x:e[0],y:e[1]})})),n.on("dblclick",(function(){t.event.stopPropagation(),r("nodeDblClick")&&(window.clearTimeout(s.clickTimer),a.nodeDblClick(t.select(this),s))})),n.on("click",(function(){if(t.event.stopPropagation(),r("nodeClick")){const e=this;window.clearTimeout(s.clickTimer),s.clickTimer=window.setTimeout((()=>{a.nodeClick(t.select(e),s)}),200)}})),n.on("mouseenter",(function(){t.event.stopPropagation(),r("nodeMouseEnter")&&a.nodeMouseEnter(t.select(this),s)})),n.on("mouseleave",(function(){t.event.stopPropagation(),r("nodeMouseLeave")&&a.nodeMouseLeave(t.select(this),s)})),l.on("click",(function(){t.event.stopPropagation(),r("edgeClick")&&a.edgeClick(t.select(this),s)})),l.on("mouseenter",(function(){t.event.stopPropagation(),r("edgeMouseEnter")&&a.edgeMouseEnter(t.select(this),s)})),l.on("mouseleave",(function(){t.event.stopPropagation(),r("edgeMouseLeave")&&a.edgeMouseLeave(t.select(this),s)}))}_enableDrag(){const e=this.chart,s=this.options,a=r(this.layout),n=e.selectAll(".node"),l=this;const d=t.drag().on("start",(function(){t.event.sourceEvent.stopPropagation()})).on("end",(function(){})).on("drag",(function(){const n=t.select(this),r=[n.datum().id,...n.selectAll(".node").data().map((e=>e.id))],d=t.select(this.parentNode).datum(),c=t.event.dx,h=t.event.dy;if(d){if(n.datum().x+n.datum().width+c>d.width||n.datum().x+c<0)return;if(n.datum().y+n.datum().height+h>d.height||n.datum().y+h<0)return}n.datum().x+=c,n.datum().y+=h,n.attr("transform",o.translate(n.datum().x,n.datum().y)),a.edges.forEach((e=>{const t=e.source,s=e.target;r.includes(t)&&r.includes(s)?e.points.forEach((e=>{e.x+=c,e.y+=h})):r.includes(t)?(e.points[0].x+=c,e.points[0].y+=h):r.includes(s)&&(e.points[e.points.length-1].x+=c,e.points[e.points.length-1].y+=h)})),e.selectAll(".edge").selectAll("path").attr("d",(e=>i(e.points))),s.useEdgeControl&&e.selectAll(".edge").each((function(){const e=t.select(this).select("path").node(),s=l.calculateEdgeControlPlacement(e);t.select(this).select(".edge-control").attr("transform",o.translate(s.x,s.y))}))}));n.call(d)}_trace(e){const t={},s=this.layout||{edges:[]},o=[];return function e(a){if({}.hasOwnProperty.call(t,a))return;t[a]=1,s.edges.filter((e=>e.data.target===a)).forEach((t=>{o.push(t),e(t.data.source)}))}(e),{edges:o.map((e=>({source:e.data.source,target:e.data.target}))),nodes:a.default.uniq([...o.map((e=>e.data.source)),...o.map((e=>e.data.target))])}}};
//# sourceMappingURL=main.js.map
