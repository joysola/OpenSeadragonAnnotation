using Domain;
using DST.Database.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DST.Database
{
    public class AnnoMarkDB : BasePatManager<AnnoMark>
    {
        /// <summary>
        /// 静态属性
        /// </summary>
        public static AnnoMarkDB CreateInstance()
        {
            return new AnnoMarkDB();
        }
        //public override List<DST_LEND_OUT_INFO> GetList()
        //{
        //    return base.GetList();
        //}

        public List<AnnoMark> GetList(string guid = null)
        {
            var result = base.simpleClient.GetList(x => guid == null || x.guid == guid);
            return result;
        }


    }
}
