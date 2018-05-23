---
noedit: true
redirect_from:
  - guides/couchbase-lite/index.html
---

<style>
  h2 {
    font-size: 24px !important;
  }
  .box-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .topics-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
  }

    @media screen and (max-width: 1000px){
      .box-container > div {
        width: 49%;
      }
    }
    @media screen and (min-width: 1000px){
      .box-container > div {
        width: 24%;
      }
    }

  .box-container > div {
  	margin-top: 10px;
    border-radius: 4px;
    color: #f2f2f2;
    background-color: rgba(0, 0, 0, 0.05);
    padding: 16px 10px;
  }
  .topics-container > div:first-child {
    font-weight: 400;
    font-size: 20px;
  }
  .topics-container > div {
    color: black;
    margin: 15px 0;
  }
  .topics-container > div a {
    background-color: rgba(170, 170, 170, 0.22);
    padding: 7px 7px;
    border-radius: 3px;
    font-size: 18px;
    font-weight: 300;
  }
</style>

<section class="body">
	<h3>Couchbase Lite</h3>
  <div class="box-container">
		<div>
			<div class="topics-container">
					<div>Swift (iOS)</div>
					<div>
						<a href="couchbase-lite/swift.html#getting-started">
							Getting Started
						</a>
					</div>
			</div>
		</div>
		<div>
			<div class="topics-container">
					<div>Java (Android)</div>
					<div>
						<a href="couchbase-lite/java.html#getting-started">
							Getting Started
						</a>
					</div>
			</div>
		</div>
		<div>
			<div class="topics-container">
					<div>C# (UWP)</div>
					<div>
						<a href="couchbase-lite/csharp.html#getting-started">
							Getting Started
						</a>
					</div>
			</div>
		</div>
		<div>
			<div class="topics-container">
					<div>Objective-C (iOS)</div>
					<div>
						<a href="couchbase-lite/objc.html#getting-started">
							Getting Started
						</a>
					</div>
			</div>
		</div>
  </div>
  <h3>Sync Gateway</h3>
  <div class="box-container">
      <div style="width: 100%;">
        <div class="topics-container">
            <div>Ubuntu - CentOS - Windows - macOS</div>
            <div>
              <a href="installation/sync-gateway/index.html">
                Getting Started
              </a>
            </div>
        </div>
      </div>
  </div>
</section>