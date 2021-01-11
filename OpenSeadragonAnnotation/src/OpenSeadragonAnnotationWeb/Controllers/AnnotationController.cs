using Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using OpenSeadragonService;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace OpenSeadragonAnnotationWeb.Controllers
{
    public class AnnotationController : Controller
    {
        private readonly IAnnotationService _annotationService;
        public readonly IWebHostEnvironment _webHostEnvironment;
        /// <summary>
        /// 构造器
        /// </summary>
        /// <param name="annotationService">service</param>
        /// <param name="webHostEnvironment">系统环境信息</param>
        public AnnotationController(IAnnotationService annotationService, IWebHostEnvironment webHostEnvironment)
        {
            _annotationService = annotationService;
            _webHostEnvironment = webHostEnvironment;
        }
        /// <summary>
        /// 主视图
        /// </summary>
        /// <returns></returns>
        public IActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 添加标注
        /// </summary>
        /// <param name="anno"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<AnnoMark> StoreAnno([FromBody] AnnoMark anno)
        {
            var result = _annotationService.StoreAnno(anno);
            return result;
        }
        /// <summary>
        /// 更新标注
        /// </summary>
        /// <param name="anno"></param>
        /// <param name="guid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<AnnoMark> UpdateAnno([FromBody] AnnoMark anno, string guid, int id)
        {
            var result = _annotationService.UpdateAnno(anno, guid, id);
            return result;
        }
        /// <summary>
        /// 删除标注
        /// </summary>
        /// <param name="anno"></param>
        /// <param name="guid"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<bool> DeleteAnno([FromBody] AnnoMark anno, string guid, int id)
        {
            var result = _annotationService.DeleteAnno(anno, guid, id);
            return result;
        }
        /// <summary>
        /// 获取数据库中的标注
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<List<AnnoMark>> GetAnnoMarks()
        {
            var result = _annotationService.GetAnnoMarks();
            return result;
        }
        /// <summary>
        /// 通过流获取Openseadragon图片(模拟img标签的src属性)
        /// </summary>
        /// <param name="level"></param>
        /// <param name="xx"></param>
        /// <param name="yy"></param>
        /// <returns></returns>
        [HttpGet]
        public IActionResult GetPicture(string level, string xx, string yy)
        {
            byte[] result = null;
            string webRootPath = _webHostEnvironment.WebRootPath;
            var path = @$"{webRootPath}\dzc_output_images\Samples\9_files\{level}";
            var provider = new PhysicalFileProvider(path);
            var fileInfo = provider.GetFileInfo($"{xx}_{yy}.jpg");
            //var filePath = Path.Combine(path, );
            //var contents = provider.GetDirectoryContents(@"dzc_output_images\Samples\9_files");
            using (Stream stream = fileInfo.CreateReadStream())
            {
                using (var memoryStream = new MemoryStream())
                {
                    stream.CopyTo(memoryStream);
                    result = memoryStream.ToArray();
                }
            }
            return File(result, "image/jpeg") ;
        }
    }
}
